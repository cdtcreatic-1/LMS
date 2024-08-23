from typing_extensions import Dict, Any
from os import getenv
from shared.utils import verbosity
from shared.db_utils import check_database_connection

from services.bussinessman_profile_services.shared.common_ms_funcs import get_lot_information

def ms_get_lot_information(input_data: Dict[str, Any]):
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
        ans = check_database_connection(dic_credentials)
        if not ans[0]:
            verbosity(f'Error de conexion: {ans[1]}', tl= 2, level='error')
            output_data['error_message'] = ans[1]
        else:
            # - Extract parameters
            verbosity(f'Extrayendo parámetros...', tl=2)
            id_lot = input_data['id_lot']
            url_pref = input_data['url']

            verbosity(f'Ejecutando servicio...', tl= 2)
            output_data = get_lot_information(id_lot, dic_credentials, url_pref)
            output_data['status'] = 'success'
            verbosity(f'SUCCESS', tl= 2, level='success')

    except Exception as e:
        verbosity(f'{type(e).__name__}, {str(e)}', tl= 2, level='error')
        output_data['error_message'] = f'{type(e).__name__}: {str(e)}'

    return output_data
