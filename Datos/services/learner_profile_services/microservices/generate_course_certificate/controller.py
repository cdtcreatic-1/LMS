from typing_extensions import Dict, Any
from os import getenv, path

from shared.db_utils import check_database_connection

from shared.utils import verbosity
from .utils import generate_course_certificate
from .constants import *

def ms_generate_course_certificate(input_data: Dict[str, Any]):
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
            verbosity(f'Conexion exitosa...', tl= 3, level='cyan')
            connection = ans[1]

            # - Extract parameters
            verbosity(f'Extrayendo parámetros...', tl=2)
            id_user, id_course = [input_data[k] for k in ('id_user', 'id_course')]

            verbosity(f'Ejecutando microservicio...', tl= 2)
            pdf_dir_path = './generated_charts'
            pdf_path = generate_course_certificate(connection, id_user, id_course,
                                              TEMPLATE_IMAGE_PATH, font_paths,
                                              pdf_dir_path)
            if not pdf_path:
                verbosity('Error al generar certificado', tl=3, level='error')
                raise RuntimeError('Error al generar certificado')
            else:
                connection.close()
                output_data['certificate_file_path'] = path.basename(pdf_path)
                output_data['status'] = 'success'
                verbosity(f'SUCCESS', tl= 2, level='success')

    except Exception as e:
        verbosity(f'{type(e).__name__}, {str(e)}', tl= 2, level='success')
        output_data['error_message'] = f'{type(e).__name__}: {str(e)}'

    return output_data
