from typing_extensions import Dict, Any
from os import getenv
from shared.utils import verbosity
from shared.db_utils import check_database_connection

from .utils import get_sorted_lots_based_on_buyer_preferences

def ms_get_sorted_lots_based_on_buyer_preferences(input_data: Dict[str, Any]):
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
            # - Extract parameters
            verbosity(f'Extrayendo parámetros.', tl=2)
            id_seller, id_buyer = [input_data[k] for k in ('id_seller', 'id_buyer')]

            verbosity(f'Ejecutando servicio...', tl= 2)
            min_purchases = 2
            df_lots = get_sorted_lots_based_on_buyer_preferences(id_seller,
                                                                 id_buyer,
                                                                 dic_credentials,
                                                                 min_purchases)
            if df_lots.empty:
                sorted_lots = []
            else:
                sorted_lots = df_lots.to_dict('records')

            output_data = {
                'sorted_lots': sorted_lots
                }

            verbosity(f'SUCCESS', tl= 2, level='success')
                    
    except Exception as e:
        verbosity(f'{type(e).__name__}: {str(e)}', tl= 2, level='error')
        output_data['error_message'] = f'{type(e).__name__}: {str(e)}'

    return output_data
