import pandas as pd
from shared.db_utils import consult_data_by_fields
from shared.utils import verbosity

def get_user_answers(connection_element, id_user: int, id_submodule: int, verb_tl=3):
    '''
    v1.0.0
    '''


    # - Get user answers for submodule ids
    sent_where = f'id_user={id_user} AND id_submodule={id_submodule};'
    df_user_answers = consult_data_by_fields(connection_element,
                                        'user_submodule_answers',
                                        ('id_question','validity'),
                                        where=sent_where
                                        )
    if len(df_user_answers) == 0:
        return None
    else:
        df_user_answers['id_question'] = df_user_answers['id_question'].apply(int)
        df_user_answers['validity'] = df_user_answers['validity'].map({0:False, 1:True})
        df_user_answers.set_index('id_question', inplace=True)
        df_user_answers.sort_index(inplace=True)
        df_user_answers['order'] = range(1, len(df_user_answers)+1)
        df_user_answers = df_user_answers[['order', 'validity']]

        # - Get question content for corresponding user answers
        verbosity('Consultando contenido de preguntas...', tl=verb_tl)
        s_ids_questions = ",".join(str(id_q) for id_q in df_user_answers.index)
        df_questions = consult_data_by_fields(connection_element,
                                            'submodule_question_table',
                                            ('id_question', 'question_content'),
                                            where=f'id_question IN ({s_ids_questions})'
                                            )
        df_questions['id_question'] = df_questions['id_question'].apply(int)
        df_questions.set_index('id_question', inplace=True)

        # - Generate dataframe
        verbosity('Consolidando estructura de datos...', tl=verb_tl)
        df_user_answers = pd.concat([df_user_answers, df_questions], axis=1)

        # - Success rate
        success_rate = consult_data_by_fields(connection_element,
                                              'user_submodule_progress',
                                              'success_rate',
                                              where=sent_where
                                              ).values.flatten()[0]

        return success_rate, df_user_answers.to_dict(orient='records')
