from typing_extensions import Dict, Any
from shared.utils import verbosity

from .utils import get_information_from_coordinate
from .constants import *

def ms_get_information_from_coordinate(input_data: Dict[str, Any]):
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
        longitude, latitude = [input_data[k] for k in ('longitude', 'latitude')]

        verbosity(f'Ejecutando servicio...', tl= 2)
        altitude, temperature, climate = get_information_from_coordinate(longitude, latitude,
                                                                         altitude_raster_path,
                                                                         temperature_raster_path,
                                                                         climate_raster_path)
        output_data.update({
            'altitude': altitude,
            'temperature': temperature,
            'climate': climate
            })
        output_data['status'] = 'success'
        verbosity(f'SUCCESS', tl= 2, level='success')

    except Exception as e:
        verbosity(f'{type(e).__name__}, {str(e)}', tl= 2, level='error')
        output_data['error_message'] = f'{type(e).__name__}: {str(e)}'

    return output_data
