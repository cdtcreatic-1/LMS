from typing_extensions import List
import pandas as pd

from shared.db_utils import consult_data_by_fields, insert_data, update_data
from shared.utils import verbosity

def obtain_success_rate_of_evaluation_results(connection_element, id_submodule: int, answers: List, verb_tl=3):
    '''
    v1.0.0
    '''

    # - Consult correct answers
    # -- Questions
    verbosity('Consultando preguntas...', tl=verb_tl)
    df_questions = consult_data_by_fields(connection_element,
                                            'submodule_question_table', ['id_question', 'question_content'],
                                            where=f'id_submodule={id_submodule}')
    ids_questions = df_questions['id_question'].values
    dic_questions_content = {int(k):v for k,v in df_questions.values}
    # -- Answers
    verbosity('Consultando respuestas correctas...', tl=verb_tl)
    sent_where = f'id_question IN ({",".join([str(i) for i in ids_questions])})'
    sent_where += ' AND answers_validity=true;'
    df_ans = consult_data_by_fields(connection_element, 'submodule_answer_table',
                                    ['id_question', 'id_answer'	], where=sent_where)
    # -- Add question content
    df_ans['question_content'] = [dic_questions_content[k] for k in df_ans['id_question']]
    grouped_answers = df_ans.groupby('id_question')

    # - Get accumulate
    verbosity('Evaluando respuestas...', tl=verb_tl)
    answers_validity = []
    for d_answer in answers:
        id_question = d_answer['id_question']
        # - Conditioning answer(s)
        id_user_answer = d_answer['id_answer']
        if isinstance(id_user_answer, int):
            id_user_answer = [id_user_answer]
        # - Get group of answers
        gdf_ans = grouped_answers.get_group(id_question)

        # - Conditioning correct answer(s)
        # -- Question with unique answer
        if len(gdf_ans) == 1:
            correct_answer = [gdf_ans['id_answer'].values[0]]
        # -- Multiple choice question
        else:
            correct_answer = list(gdf_ans['id_answer'])

        # - Compare answers
        validity = True if list(id_user_answer) == correct_answer else False
        answers_validity.append({'question': gdf_ans['question_content'].values[0],
                                     'validity': validity})

    # - Get success rate
    verbosity('Calculando procentaje de acierto...', tl=verb_tl)
    accum = [d['validity'] for d in answers_validity]
    succes_rate = round((accum.count(True)/len(accum))*100)
    verbosity(f'{accum}: {succes_rate}', tl=verb_tl+1, level='cyan')

    # - 
    
    df_answers_validity = pd.DataFrame({
        'id_submodule': id_submodule,
        'id_question': [d['id_question'] for d in answers],
        'validity': [d['validity'] for d in answers_validity]
        })

    return succes_rate, answers_validity, df_answers_validity

def update_submodule_progress(connection_element, id_user, id_submodule,
                              success_rate, is_completed, verb_tl=3):
    '''
    ...
    V1.0.0
    '''
    # - Create dataframe
    is_completed = 1 if is_completed else 0
    df = pd.DataFrame({'id_user': [id_user],
                    'id_submodule': [id_submodule],
                    'success_rate':[success_rate],
                    'is_completed':[bool(is_completed)]})

    # - Check for user and submodule registration existence
    current_data = consult_data_by_fields(connection_element,
                                        'user_submodule_progress',
                                        where=f'id_user={id_user} AND id_submodule={id_submodule}')
    # -- Update record
    if len(current_data):
        current_rate = current_data.loc[0,'success_rate']
        verbosity(f'Porcentaje actual: {current_rate}', tl=verb_tl+1, level='cyan')
        verbosity('Actualizando datos...', tl=verb_tl)
        if current_rate >= success_rate:
            verbosity('Datos no actualizados, porcentaje existente mayor o igual al nuevo', tl=verb_tl+1,
                      level='cyan')
            data_updated = False
        else:
            update_data(connection_element, 'user_submodule_progress', ('success_rate', 'is_completed'), df)
            verbosity('Datos actualizados.', tl=verb_tl+1, level='cyan')
            data_updated = True

        # verbosity('Actualizando datos...', tl=verb_tl)
        # if [current_data.loc[0,'success_rate'], current_data.loc[0,'is_completed']] == [success_rate, is_completed]:
        #     verbosity('Datos no actualizados, mismos datos ya existentes.', tl=verb_tl+1)
        #     data_updated = False
        # else:
        #     update_data(connection_element, 'user_submodule_progress', ('success_rate', 'is_completed'), df)
        #     verbosity('Datos actualizados.', tl=verb_tl+1)
        #     data_updated = True

    # -- Create record
    else:
        verbosity('Insertando nuevo registro...', tl=verb_tl)
        insert_data(connection_element, 'user_submodule_progress', df)
        verbosity('Nuevo registro insertado.', tl=verb_tl+1)
        data_updated = True
        
    return data_updated

def update_submodule_answers(connection_element, id_user, id_submodule, df_answers_validity, verb_tl=3):

    # - Add id_user to dataframe
    df_answers_validity['id_user'] = id_user

    # - Check for user and submodule registration existence
    current_data = consult_data_by_fields(connection_element,
                                            'user_submodule_answers',
                                            ('id_submodule', 'id_question', 'validity', 'id_user'),
                                            where=f'id_user={id_user} AND id_submodule={id_submodule}')

    # -- Update record
    if len(current_data):
        current_data['validity'] = [bool(v) for v in current_data['validity']]
        if current_data.equals(df_answers_validity):
            verbosity('Datos no actualizados, mismos datos ya existentes.', tl=verb_tl+1)
            data_updated = False

        else:
            update_data(connection_element, 'user_submodule_answers', 'validity', df_answers_validity)
            verbosity('Datos actualizados.', tl=verb_tl+1)
            data_updated = True

    # -- Create record
    else:
        verbosity('Insertando nuevo registro...', tl=verb_tl)
        insert_data(connection_element, 'user_submodule_answers', df_answers_validity)
        verbosity('Nuevo registro insertado.', tl=verb_tl+1)
        data_updated = True

    return data_updated
