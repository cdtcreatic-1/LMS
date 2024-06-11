import openai

from shared.func_utils import execute_function_with_timeout
from shared.utils import verbosity
from .constants import dic_course_thematic_mapping

def consult_chatgpt(question: str, course_name: str,
                    api_key:str, model: str = 'gpt-3.5-turbo'):
    '''
    Updated for various courses thematics
    v2.0.0
    '''

    # - Set api key
    openai.api_key = api_key

    # - Asistant message
    asistant_message = 'Vas a actuar como un experto con conocimientos para un curso con la siguiente temática: "<thematic>", \
    tu labor consiste en responder preguntas únicamente sobre dicha temática. \
    Rechaza preguntas fuera de este tema, aclarando que solo respondes a consultas relacionadas con la temática en cuestión.'
    
    asistant_message = asistant_message.replace('<thematic>', dic_course_thematic_mapping[course_name])

    # - Get response
    verbosity(f'Obteniendo respuesta...', tl=3)
    response = openai.ChatCompletion.create(
        model= model,
        messages = [
            {'role': 'system', 'content': asistant_message},
            {'role': 'user', 'content': question}
        ],
        temperature = 0
    )
    verbosity(response)

    total_tokens = response.usage.total_tokens
    answer = response.choices[0].message.content
    verbosity(f'Numero de tokens usados: {total_tokens}', tl=3, level='cyan')

    return answer

def use_chatgpt_as_chatbot(question: str, course_name: str, api_key: str, model: str = 'gpt-3.5-turbo',
                           execute_with_timeout: bool = True, maximum_wait_time: int = 30,
                           verb: bool = False):
    
    dic_params = {
        'question': question,
        'course_name': course_name,
        'api_key': api_key,
        'model': model
    }

    if api_key is None:
        raise ValueError("Api key no proporcionada")
    else:
        try:
            if execute_with_timeout:
                answer = execute_function_with_timeout(maximum_wait_time, consult_chatgpt,
                                                    dic_params)
            else:
                answer = consult_chatgpt(**dic_params)

        except Exception as e:
            verbosity(e, level='error')
            answer = None
        
    return answer
