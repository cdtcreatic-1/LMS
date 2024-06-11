from typing_extensions import Dict, Any
from os import getenv
from shared.utils import verbosity
from shared.db_utils import check_database_connection
from .constants import village_ids_raster_path, city_ids_raster_path

from .utils import get_entities_ids_from_coordinate

def ms_get_entities_ids_from_coordinate(input_data: Dict[str, Any]):
    ''' 
    ...
    v1.0.0
    '''
    # - Default output_data
    output_data = {
        'status': 'failed'
        }
    
    try:
        # - Check database connection
        dic_credentials = {
            'dbname': getenv('POSTGRES_INITDB_DATABASE'),
            'user': getenv('POSTGRES_INITDB_USERNAME'),
            'password': getenv('POSTGRES_INITDB_PASSWORD'),
            'host': getenv('POSTGRES_INITDB_HOST'),
            'port': getenv('POSTGRES_INITDB_PORT'),
            }
        
        # - Check connection to database
        verbosity(f'Comprobando conexion a base de datos...', tl= 2)
        ans = check_database_connection(dic_credentials, True)
        if not ans[0]:
            verbosity(f'Error de conexion: {ans[1]}', tl= 2, level='error')
            output_data['error_message'] = ans[1]

        else:
            verbosity(f'Conexion exitosa...', tl= 3)
            connection = ans[1]

            # - Extract parameters
            verbosity(f'Extrayendo parámetros.', tl=2)
            # - Read and conditioning input data
            longitude, latitude = [input_data[k] for k in ('longitude', 'latitude')]
            verbosity(f'({longitude}, {latitude})', tl=3)
            
            verbosity(f'Ejecutando servicio...', tl= 2)
            dic_output = get_entities_ids_from_coordinate(connection,
                                                   longitude, latitude,
                                                   village_ids_raster_path,
                                                   city_ids_raster_path
                                                   )
            
            if dic_output:
                output_data.update(dic_output)
                output_data['status'] = 'success'
                verbosity(f'SUCCESS', tl= 2, level='success')
            else:
                output_data['error_message'] = 'An error has occurred, please check logs'
                verbosity(f'FAILED', tl= 2, level='error')

    except Exception as e:
        verbosity(f'{type(e).__name__}, {str(e)}', tl= 2, level='error')
        output_data['error_message'] = f'{type(e).__name__}: {str(e)}'

    return output_data
