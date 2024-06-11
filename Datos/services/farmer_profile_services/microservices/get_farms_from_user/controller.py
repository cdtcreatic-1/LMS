from typing_extensions import Dict, Any
from os import getenv

from shared.utils import verbosity
from shared.db_utils import check_database_connection, check_existence_of_field_and_value
from .utils import get_farms_from_user

def ms_get_farms_from_user(input_data: Dict[str, Any]):
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
        ans = check_database_connection(dic_credentials, return_connection=True)
        if not ans[0]:
            verbosity(f'Error de conexion: {ans[1]}', tl= 2, level='error')
            output_data['error_message'] = ans[1]

        else:
            verbosity(f'Conexion exitosa...', tl= 3)
            connection = ans[1]

            # - Extract parameters
            verbosity(f'Extrayendo parámetros...', tl=2)
            id_user = input_data['id_user']
            
            verbosity(f'Verificando existencia de usuario en base de datos...', tl=2)
            if not check_existence_of_field_and_value(connection,
                                                      'users_table', 'id_user', id_user):
                raise ValueError ('id de usuario no existe en base de datos')
            else:
                verbosity(f'Ejecutando servicio...', tl= 2)
                # - Obtain success rate of evaluation results 
                dic_farms_info = get_farms_from_user(connection, id_user)
                output_data = {
                    'farms_info': dic_farms_info
                }
                output_data['status'] = 'success'
                verbosity(f'SUCCESS\n', tl= 2, level='success')

    except Exception as e:
        verbosity(f'{type(e).__name__}, {str(e)}', tl= 2, level='error')
        output_data['error_message'] = f'{type(e).__name__}: {str(e)}'

    return output_data
