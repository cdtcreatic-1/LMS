from typing_extensions import Dict, Any
from os import getenv

from shared.utils import verbosity
from .utils import use_chatgpt_as_chatbot
from .constants import dic_course_thematic_mapping

def ms_make_a_chatbot_query(input_data: Dict[str, Any]):
    ''' 
    ...
    v1.0.0
    '''
    # - Default output_data
    output_data = {
        'status': 'failed'
        }
    
    try:
        # - Extract parameters
        verbosity(f'Extrayendo parámetros.', tl=2)
        question, course_name = [input_data[k] for k in ('question', 'course_name')]

        # - Validate course
        if not course_name.lower() in dic_course_thematic_mapping.keys():
            verbosity(f'El curso {course_name} no está mapeado', level='error')
            raise KeyError(f'El curso -{course_name}- no está mapeado')

        verbosity(f'Ejecutando servicio...', tl= 2)
        model = 'gpt-3.5-turbo'
        api_key = getenv('OPENAI_API_KEY')
        answer = use_chatgpt_as_chatbot(question, course_name.lower(), api_key, model,
                                        execute_with_timeout=True)
        
        output_data = {
            "answer": answer
        }
        output_data['status'] = 'success'
        verbosity(f'SUCCESS\n', tl= 2, level='success')

    except Exception as e:
        verbosity(f'{type(e).__name__}, {str(e)}', tl= 2, level='success')
        output_data['error_message'] = f'{type(e).__name__}: {str(e)}'

    return output_data
