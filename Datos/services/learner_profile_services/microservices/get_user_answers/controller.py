from typing_extensions import Dict, Any
from os import getenv

from shared.db_utils import check_database_connection

from shared.utils import verbosity
from .utils import *

def ms_get_user_answers(input_data: Dict[str, Any]):
    ''' 
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
            id_user, id_submodule = [input_data[k] for k in ('id_user', 'id_submodule')]

            verbosity(f'Ejecutando servicio...', tl= 2)
            ans = get_user_answers(connection, id_user, id_submodule)

            if ans is None:
                output_data['error_message'] = 'Usuario no registra respuestas en base de datos'
                verbosity('Usuario no registra respuestas en base de datos', tl=2, level='error')
            else:
                success_rate, dic_user_answers = ans
                output_data.update({
                    'user_answers': dic_user_answers,
                    'success_rate': int(success_rate)
                    })

                connection.close()
                output_data['status'] = 'success'
                verbosity(f'SUCCESS', tl= 2, level='success')
    
    except Exception as e:
        verbosity(f'{type(e).__name__}, {str(e)}', tl= 2, level='success')
        output_data['error_message'] = f'{type(e).__name__}: {str(e)}'

    return output_data
