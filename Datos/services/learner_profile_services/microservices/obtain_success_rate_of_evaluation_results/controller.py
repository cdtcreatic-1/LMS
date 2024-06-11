from typing_extensions import Dict, Any
from os import getenv

from shared.db_utils import check_database_connection

from shared.utils import verbosity
from .utils import *

def ms_obtain_success_rate_of_evaluation_results(input_data: Dict[str, Any]):
    ''' 
    Gets the percentage of success of the evaluation results of a submodule,
    and updates record in database.
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
            id_user, id_submodule, answers = [input_data[k] for k in ('id_user', 'id_submodule', 'answers')]

            verbosity(f'Ejecutando servicio...', tl= 2)
            # - Obtain success rate of evaluation results
            verbosity(f'Obteniendo porcentaje de acierto...', tl= 3)
            success_rate, dic_answers_validity, df_answers_validity = obtain_success_rate_of_evaluation_results(connection, id_submodule, answers)
            output_data.update({
                'succes_rate': success_rate,
                'answers_validity': dic_answers_validity,
                'data_updated': False
                })
            # - 
            minimum_rate = 65
            is_completed = success_rate >= minimum_rate

            verbosity(f'Actualizando progreso de submodulo...', tl= 2)
            submodule_progress_updated = update_submodule_progress(connection, id_user, id_submodule, success_rate, is_completed)
            output_data['submodule_progress_updated'] = submodule_progress_updated

            verbosity(f'Actualizando respuestas de usuario...', tl= 2)
            if submodule_progress_updated:
                user_answers_updated = update_submodule_answers(connection, id_user, id_submodule, df_answers_validity)
            else:
                verbosity(f'Se conservan respuestas anteriores', tl= 3, level='cyan')
                user_answers_updated = False
            output_data['user_answers_updated'] = user_answers_updated

            connection.close()
            output_data['status'] = 'success'
            verbosity(f'SUCCESS', tl= 2, level='success')
   
    except Exception as e:
        verbosity(f'{type(e).__name__}, {str(e)}', tl= 2, level='success')
        output_data['error_message'] = f'{type(e).__name__}: {str(e)}'

    return output_data
