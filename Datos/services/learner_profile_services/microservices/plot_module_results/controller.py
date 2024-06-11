from typing_extensions import Dict, Any
from os import getenv, path

from shared.db_utils import check_database_connection

from shared.utils import verbosity
from .utils import obtain_percentages_module_results, generate_progress_chart

def ms_plot_module_results(input_data: Dict[str, Any]):
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
            id_user, id_course = [input_data[k] for k in ('id_user', 'id_course')]

            verbosity(f'Ejecutando servicio...', tl= 2)
            # - Obtain percentages module results
            modules_titles, modules_percents = obtain_percentages_module_results(connection,
                                                                                 id_user, id_course)

            # - Generate chart
            font_paths = ('./static/fonts/Lato-Regular.ttf', './static/fonts/Roboto-Regular.ttf')
            file_name = f'course_progress_{id_user}-{id_course}.png'
            chart_path = path.join(f'generated_charts', file_name)
            generate_progress_chart(modules_titles, modules_percents, font_paths, chart_path)

            output_data.update({
                'chart_path': file_name
            })
            connection.close()
            output_data['status'] = 'success'
            verbosity(f'SUCCESS', tl= 2, level='success')
   
    except Exception as e:
        verbosity(f'{type(e).__name__}, {str(e)}', tl= 2, level='success')
        output_data['error_message'] = f'{type(e).__name__}: {str(e)}'

    return output_data
