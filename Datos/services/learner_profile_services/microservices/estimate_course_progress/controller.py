from typing_extensions import Dict, Any
from os import getenv, path, mkdir

from shared.db_utils import check_database_connection, check_existence_of_combined_elements

from shared.utils import verbosity
from .utils import *

def ms_estimate_course_progress(input_data: Dict[str, Any]):
    ''' 
    Gets the degree of progress in a course for a given user
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

            # - Verify existence of ids combination
            verbosity(f'Verficiando existencia de elementos...', tl=2)
            elms = [('id_user', id_user), ('id_course', id_course)]
            if not check_existence_of_combined_elements(connection, 'users_courses_table', elms):
                verbosity(f'No se encontro registro que comprenda los ids provistos', tl=2, level='error')
                output_data['error_message'] = f'Combinacion de elementos no encontrada en base de datos'
            else:
                # - Obtain progress_rate
                verbosity(f'Obteniendo porcentaje de progreso del curso...', tl= 2)
                progress_rate = estimate_course_progress(connection, id_user, id_course)
                output_data.update({
                    'progress_rate': progress_rate
                    })

                # - Obtain percentages module results
                verbosity(f'Obteniendo porcentajes de progreso de submodulos...', tl= 2)
                modules_titles, modules_percents = obtain_percentages_module_results(connection,
                                                                                    id_user, id_course)
                verbosity(f'{modules_titles} {modules_percents}', tl= 3, level='cyan')
                verbosity(f'Estructurando datos de salida...', tl= 2)
                data = [{'label': mt, 'value': int(mp)} for mt, mp in zip(modules_titles, modules_percents)]
 
                # # - Generate chart
                # font_paths = ('./static/fonts/Lato-Regular.ttf', './static/fonts/Roboto-Regular.ttf')
                # file_name = f'course_progress_{id_user}-{id_course}.png'
                # chart_path = path.join(f'generated_charts', file_name)
                # if not path.isdir('generated_charts'):
                #     mkdir('generated_charts')

                # verbosity(f'Generando grafica...', tl= 2)
                # generate_progress_chart(modules_titles, modules_percents, font_paths, chart_path)

                output_data.update({
                'data': data
                })
                
                connection.close()
                output_data['status'] = 'success'
                verbosity(f'SUCCESS', tl= 2, level='success')
            connection.close()

    except Exception as e:
        verbosity(f'{type(e).__name__}, {str(e)}', tl= 2, level='success')
        output_data['error_message'] = f'{type(e).__name__}: {str(e)}'

    return output_data
