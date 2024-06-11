from typing_extensions import Dict, Any
from os import getenv
from shared.utils import verbosity, validate_parameters
from shared.db_utils import check_database_connection

from .utils import get_products_by_filtered_search

def ms_get_products_by_filtered_search(input_data: Dict[str, Any]):
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
            connection = ans[1]
            # - Extract parameters
            verbosity(f'Extrayendo parámetros...', tl=2)
            expected_params = ('service', 'microservice', 'lot_properties', 'price_range', 'id_state')
            # - Validate params
            for param in input_data.keys():
                if not validate_parameters(param, expected_params)[0]:
                    raise KeyError(f'nombre de parámetro no válido: {param}')

            verbosity(f'Ejecutando servicio...', tl= 2)
            dics_info = get_products_by_filtered_search(input_data, connection)
            output_data = {
                'lots_information': dics_info
            }
            output_data['status'] = 'success'
            verbosity(f'SUCCESS', tl= 2, level='success')
            connection.close()

    except Exception as e:
        verbosity(f'{type(e).__name__}, {str(e)}', tl= 2, level='error')
        output_data['error_message'] = f'{type(e).__name__}: {str(e)}'

    return output_data
