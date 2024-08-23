from typing_extensions import Dict, Any
from shared.utils import verbosity

from .utils import get_geoinformation_from_polygon
from .constants import *

def ms_get_geoinformation_from_polygon(input_data: Dict[str, Any]):
    ''' 
    ...
    v1.0.0
    '''
    # - Default output_data
    output_data = {
        'status': 'failed'
        }
    
    try:
        path_json_geoinformation = './static/geodata/colombia_polygons_geoinformation.json'
        # - Extract parameters
        verbosity(f'Extrayendo parámetros.', tl=2)
        id_state, id_city, id_village = [input_data[k] for k in ('id_state', 'id_city', 'id_village')]
        if [id_state, id_city, id_village] == [None]*3:
            raise ValueError('No se ha proporcionado ningun id')
        verbosity(f'Ejecutando servicio...', tl= 2)
        dic_geoinfo = get_geoinformation_from_polygon(id_state, id_city, id_village,
                                                      path_csv_states_geoinfo,
                                                      path_csv_cities_geoinfo,
                                                      path_csv_villages_geoinfo
                                                      )
        
        if dic_geoinfo:
            verbosity(dic_geoinfo['entity_name'], tl=4, level='cyan')
            output_data.update(dic_geoinfo)
            output_data['status'] = 'success'
            verbosity(f'SUCCESS', tl= 2, level='success')
        else:
            output_data['error_message'] = 'An error has occurred, please check logs'
            verbosity(f'FAILED', tl= 2, level='error')

    except Exception as e:
        verbosity(f'{type(e).__name__}, {str(e)}', tl= 2, level='error')
        output_data['error_message'] = f'{type(e).__name__}: {str(e)}'

    return output_data
