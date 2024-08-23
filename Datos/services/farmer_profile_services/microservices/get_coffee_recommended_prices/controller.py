from typing_extensions import Dict, Any
from shared.utils import verbosity

from .utils import get_coffee_recommended_prices

def ms_get_coffee_recommended_prices(input_data: Dict[str, Any]):
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
        variety_name = input_data['variety_name']
        
        verbosity(f'Ejecutando servicio...', tl= 2)
        lower_price, recommended_price, higher_price = get_coffee_recommended_prices(variety_name)
        output_data = {
            'lower_price' : lower_price,
            'recommended_price' : recommended_price,
            'higher_price' : higher_price
        }

        verbosity(f'SUCCESS', tl= 2, level='success')

    except Exception as e:
        verbosity(f'{type(e).__name__}, {str(e)}', tl= 2, level='error')
        output_data['error_message'] = f'{type(e).__name__}: {str(e)}'

    return output_data
