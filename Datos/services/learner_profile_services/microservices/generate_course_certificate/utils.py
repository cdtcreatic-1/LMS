import datetime
from pathlib import *
from PIL import Image
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import matplotlib.font_manager as font_manager
from os import getcwd, path, remove

from shared.db_utils import check_existence_of_combined_elements, consult_data_by_fields, consult_data
from shared.utils import verbosity

def get_user_name_and_course_title(connection_element, id_user: int, id_course: int,
                                   tl_ini=4):
    '''
    v1.0.0
    '''

    verbosity('Comprobando relación de usuario y curso', tl=tl_ini)
    ids_exists = check_existence_of_combined_elements(connection_element,
                                        'users_courses_table',
                                        [['id_user', id_user],['id_course', id_course]]
                                        )
    if not ids_exists:
        verbosity(f'Relación entre usuario {id_user} y curso {id_course} no encontrada',
                  tl=tl_ini+1, level='error')
        raise ValueError(f'Relación entre usuario y curso no encontrada')
    else:
        verbosity('Relación encontrada', tl=tl_ini+1, level='cyan')
        # - 
        verbosity('Validando completitud del curso...', tl=tl_ini)
        progress_percent = consult_data_by_fields(connection_element,
                                                'users_courses_table',
                                                'progress_percent',
                                                f'id_user={id_user} AND id_course={id_course}'
                                                ).values.flatten()[0]
        if progress_percent is None or progress_percent!= 100:
            verbosity(f'El usuario no ha completado el curso: porcentaje de progreso: {progress_percent}',
                  tl=tl_ini+1, level='error')
            raise ValueError (f'El usuario no ha completado el curso: porcentaje de progreso: {progress_percent}')
        else:
            verbosity('Curso completado', tl=tl_ini+1, level='cyan')
            # - Consult info
            verbosity('Realizando consulta de informacion de usuario y curso...', tl=tl_ini)
            sent = 'SELECT u.user_name, c.course_title, c.course_duration \
            FROM users_table u \
            CROSS JOIN ( \
                SELECT course_title, course_duration \
                FROM course_table \
                WHERE id_course = <id_course> \
            ) c \
            WHERE u.id_user = <id_user>;'
            sent = sent.replace('<id_user>', str(id_user)).replace('<id_course>', str(id_course))
            user_name, course_title, course_duration = consult_data(connection_element, sent).flatten()
            verbosity(f'{user_name} | {course_title} | {course_duration}', tl=tl_ini+1, level='cyan')

            # - Get current date
            verbosity('Obteniendo fecha actual...', tl=tl_ini)
            months_spa = ('Enero', 'Febrero', 'Marzo', 'Abri', 'Mayo', 'Junio',
                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre')
            dic_months_spa = {k:v for k,v in zip(range(1,13), months_spa)}
            current_date = datetime.date.today()
            year, month, day = current_date.isoformat().split('-')
            current_date = f'{day} de {dic_months_spa[int(month)].lower()} de {year}'
            verbosity(f'La fecha actual es {current_date}', tl=tl_ini+1, level='cyan')
            
    return user_name, course_title, course_duration, current_date

def generate_certificate_image(template_image_path: str, output_image_path: str,
                               user_name: str,
                               course_title: str, course_duration: str,
                               current_date: str,
                               font_paths,
                               dpi=250, tl_ini=4):
    
    # - Add fonts
    verbosity('Agregando fuentes...', tl=tl_ini)
    for font_path in font_paths:
        font_manager.fontManager.addfont(font_path)

    # - Diccionarios
    verbosity('Generando diccionarios de propiedades de texto...', tl=tl_ini)
    dic_gral = {'weight': 'black', 'ha': 'center', 'va': 'center'}
    dic_text_course = {'color': '#1A205E', 'fontsize': 18, 'fontname':'Roboto'}
    dic_text_user = {'color': '#2F0084', 'fontsize': 18, 'fontname':'Lato'}
    dic_text_course.update(dic_gral)
    dic_text_user.update(dic_gral)
    dic_text_date_duration = {'color': 'k', 'fontsize': 5, 'fontname': "Lato", 'weight': 'bold'}

    verbosity('Abriendo imagen plantilla...', tl=tl_ini)
    image = mpimg.imread(template_image_path)
    verbosity('Creando nueva imagen basada en plantilla...', tl=tl_ini)

    _, ax = plt.subplots(dpi=dpi)
    plt.axis('off')
    ax.imshow(image)

    verbosity('Agregando textos...', tl=tl_ini)
    ax.text(0.5, 0.508, course_title.upper(), transform=ax.transAxes, **dic_text_course)
    ax.text(0.5, 0.34, user_name.title(), transform=ax.transAxes, **dic_text_user)
    ax.text(1585, 2046, current_date, **dic_text_date_duration)
    ax.text(1655, 2110, course_duration, **dic_text_date_duration)

    verbosity('Exportando imagen temporal...', tl=tl_ini)
    plt.savefig(output_image_path, bbox_inches='tight', pad_inches=0)
    plt.close()

    return 1

def convert_image_to_pdf(image_path: str, pdf_path: str):
    with Image.open(image_path) as image:
        im = image.convert("RGB")
        pth = Path(pdf_path)
        im.save(pth, save_all=True)

    return 1

def generate_course_certificate(connection_element,
                                id_user: str, id_course: str,
                                template_image_path: str, font_paths,
                                pdf_dir_path: str, tl_ini=3):
    '''
    v1.0.0
    '''

    verbosity('Consultando nombre de usuario, titulo y duracion del curso...',
              tl=tl_ini)
    user_name, course_title, course_duration, current_date = get_user_name_and_course_title(connection_element, id_user, id_course)

    # - 
    pdf_file_name = f'course_certificate_{id_user}-{id_course}.pdf'
    output_image_path = path.join(getcwd(), pdf_file_name.replace('pdf', 'jpg'))

    verbosity('Generando imagen de certificado...', tl=tl_ini)
    image_generated = generate_certificate_image(template_image_path, output_image_path,
                                                user_name, course_title, course_duration,
                                                current_date, font_paths)

    if not image_generated:
        verbosity('Error al generar imagen', tl=tl_ini, level='error')
    else:
        verbosity('Imagen generada con exito...', tl=tl_ini+2, level='cyan')

        verbosity('Convirtiendo imagen a pdf...', tl=tl_ini)
        pdf_path = path.join(pdf_dir_path, pdf_file_name)
        pdf_generated = convert_image_to_pdf(output_image_path, pdf_path)

        if not pdf_generated:
            verbosity('Error al convertir imagen', tl=tl_ini+1, level='error')
            raise RuntimeError('Error al convertir imagen')
        else:
            verbosity('Eliminando imagen temporal...', tl=tl_ini)
            remove(output_image_path)
            verbosity('Imagen temporal eliminada...', tl=tl_ini+1, level='cyan')
            verbosity('Certificado generado con exito', tl=tl_ini+1, level='cyan')

    return pdf_path
