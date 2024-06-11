from typing_extensions import Dict, Any
from shared.utils import verbosity

from .utils import estimate_learning_style
    
def ms_estimate_learning_style(input_data: Dict[str, Any]):
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
        answers_list = input_data['answers']

        verbosity(f'Ejecutando servicio...', tl= 2)
        learning_style = estimate_learning_style(answers_list)
        
        output_data = {
            "learning_style": learning_style
        }
        output_data['status'] = 'success'
        verbosity(f'SUCCESS\n', tl= 2)

    except Exception as e:
        verbosity(f'{type(e).__name__}, {str(e)}', tl= 2, level='error')
        output_data['error_message'] = f'{type(e).__name__}: {str(e)}'

    return output_data
