from typing_extensions import Dict, Any
from os import getenv

from shared.utils import verbosity
from .utils import make_a_chatbot_query2
from .constants import *

def ms_make_a_chatbot_query2(input_data: Dict[str, Any]):
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
        course_name = course_name.lower()
        if not dic_course_thematic_mapping.__contains__(course_name):
            s = 'Nombre de curso no válido'
            verbosity(s, tl=3, level='error')
            raise ValueError(s)
        else:
            api_key = getenv('OPENAI_API_KEY')
            answer = make_a_chatbot_query2(question, course_name, api_key)
            if answer:
                output_data.update({'answer': answer})
                output_data['status'] = 'success'
                verbosity(f'SUCCESS\n', tl= 2, level='success')
            else:
                s = 'Respuesta no obtenida'
                verbosity(s, tl=3, level='error')
                raise ValueError(s)
            
    except Exception as e:
        verbosity(f'{type(e).__name__}, {str(e)}', tl= 2, level='success')
        output_data['error_message'] = f'{type(e).__name__}: {str(e)}'

    return output_data
