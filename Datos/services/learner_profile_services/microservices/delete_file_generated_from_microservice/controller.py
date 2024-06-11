from typing_extensions import Dict, Any
from os import path, remove
from shared.utils import verbosity

def ms_delete_file_generated_from_microservice(input_data: Dict[str, Any]):
    ''' 
    v1.0.0
    '''
    # - Default output_data
    output_data = {
        'status': 'failed'
        }
    
    try:
        # - Extract parameters
        verbosity(f'Extrayendo parámetros...', tl=2)
        target_microservice, id_user, id_course = [input_data[k] for k in ('target_microservice', 'id_user', 'id_course')]

        microservices = ('estimate_course_progress', 'generate_course_certificate')
        if not target_microservice in microservices:
            verbosity(f'Microservicio recibido no genera archivos en directorio de interes', tl=3)
            raise ValueError('Microservicio recibido no genera archivos en directorio de interes')
        else:
            # - Get file name
            if target_microservice == 'estimate_course_progress':
                file_path = path.join('generated_charts', f'course_progress_{id_user}-{id_course}.png')
            elif target_microservice == 'generate_course_certificate':
                file_path = path.join('generated_charts', f'course_certificate_{id_user}-{id_course}.pdf')
            verbosity(f'{file_path}', tl=3, level='cyan')

            # - Delete file
            if path.isfile(file_path):
                verbosity(f'Archivo encontrado: {file_path}', tl=3)
                remove(file_path)
                verbosity('Archivo eliminado', tl=3, level='cyan')
                output_data['status'] = 'success'
                verbosity(f'SUCCESS', tl= 2, level='success')
            else:
                verbosity(f'Archivo no encontrado: {file_path}', tl=3, level='error')
                verbosity(f'FAILED', tl= 2, level='error')
                output_data['error_message'] = 'Archivo no encontrado'
            
    except Exception as e:
        verbosity(f'{type(e).__name__}, {str(e)}', tl= 2, level='success')
        output_data['error_message'] = f'{type(e).__name__}: {str(e)}'

    return output_data
