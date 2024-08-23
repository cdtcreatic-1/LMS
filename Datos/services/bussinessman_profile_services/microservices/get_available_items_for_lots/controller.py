from typing_extensions import Dict, Any
from os import getenv
from shared.utils import verbosity
from shared.db_utils import check_database_connection

from .utils import validate_minimum_number_of_lots, get_available_items_for_lots

def ms_get_available_items_for_lots():
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
            verbosity(f'Validando cantidad minima de lotes...', tl= 2)
            if validate_minimum_number_of_lots(dic_credentials, 2):
                verbosity(f'Ejecutando servicio...', tl= 2)
                output_data = get_available_items_for_lots(dic_credentials)
                output_data['status'] = 'success'
                verbosity(f'SUCCESS', tl= 2, level='success')
            else:
                output_data['error_message'] = 'No hay suficientes lotes en base de datos'
                raise IndexError(output_data['error_message'])

    except Exception as e:
        output_data['error_message'] = f'{type(e).__name__}: {str(e)}'
        verbosity(output_data['error_message'], level='error')

    return output_data
