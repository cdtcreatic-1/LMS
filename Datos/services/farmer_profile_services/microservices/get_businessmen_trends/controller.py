from typing_extensions import Dict, Any
from os import getenv
from shared.utils import verbosity
from shared.db_utils import check_database_connection

from .utils import get_businessmen_trends, generate_charts

def ms_get_businessmen_trends(input_data):
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
            verbosity(f'Conexion exitosa...', tl= 3)


            verbosity(f'Ejecutando servicio...', tl= 2)
            pref = input_data['url']
            ranking = get_businessmen_trends(dic_credentials, pref, num_persons=10)
            #- Generate charts
            verbosity(f'Generando charts...', tl= 2)
            generate_charts(ranking, pref)
            output_data = {
                'ranking': ranking
                }
            output_data['status'] = 'success'
            verbosity(f'SUCCESS', tl= 2, level='success')
                    
    except Exception as e:
        verbosity(f'{type(e).__name__}: {str(e)}', tl= 2, level='error')
        output_data['error_message'] = f'{type(e).__name__}: {str(e)}'

    return output_data
