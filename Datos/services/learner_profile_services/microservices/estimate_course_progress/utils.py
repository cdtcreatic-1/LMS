import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.font_manager as font_manager
from matplotlib.ticker import FuncFormatter

from shared.db_utils import consult_data_by_fields, consult_data, update_data, check_existence_of_field_and_value
from shared.utils import verbosity

def estimate_course_progress(connection_element, id_user: int, id_course: int, verb_tl=3):
    '''
    ...
    v1.0.0
    '''

    # - Consult the modules associated with the course
    verbosity('Consultando modulos asociados al curso...', tl=verb_tl)
    ids_modules = consult_data_by_fields(connection_element, 'module_table', 'id_module',
                                        where=f'id_course={id_course}').values.flatten()
    if len(ids_modules) == 0:
        verbosity(('No existen modulos para el curso proporcionado'),tl=verb_tl, level='error')
        raise IndexError('No existen modulos para el curso proporcionado')
    else:
        # - Consult submodules associated with the course
        verbosity('Consultando submodulos asociados al curso...', tl=verb_tl)
        ids_submodules = consult_data_by_fields(connection_element, 'submodule_table', 'id_submodule',
                            where=f'id_module IN ({", ".join([str(idd) for idd in ids_modules])})'
                            ).values.flatten()
        if len(ids_submodules) == 0:
            verbosity(('No existen submodulos para el curso proporcionado'),tl=verb_tl, level='error')
            raise IndexError('No existen submodulos para el curso proporcionado')
        else:
            verbosity(f'{len(ids_submodules)} submodulos encontrados', tl=verb_tl+1)
            # - Consult number of completed submodules
            verbosity('Consultando numero de submodulos completados...', tl=verb_tl)
            sent_where = f'id_user = {id_user}'
            sent_where += f' AND id_submodule IN ({", ".join([str(idd) for idd in ids_submodules])})'
            sent_where += ' AND is_completed = true'
            num_submodules_completed = consult_data(connection_element,
                                                    f'SELECT COUNT(*) FROM user_submodule_progress WHERE {sent_where}'
                                                    ).flatten()[0]
            verbosity(f'{num_submodules_completed} submodulos completados', tl=verb_tl+1)
            # - Calculate course progress rate
            verbosity('Calculando grado de progreso...', tl=verb_tl)
            progress_rate = round((num_submodules_completed/len(ids_submodules))*100)
            verbosity(f'{progress_rate}%', tl=verb_tl+1, level='cyan')

            # - Consult current progress percent for user and course
            verbosity('Consultando grado de progreso registrado...', tl=verb_tl)
            sent_where = f'id_user = {id_user} AND id_course = {id_course}'
            current_progress_percent = consult_data_by_fields(connection_element,
                                                            'users_courses_table', 'progress_percent',
                                                            where=sent_where).values.flatten()[0]
            # - Update value in database
            verbosity('Validando grado de progreso registrado...', tl=verb_tl)
            if current_progress_percent != progress_rate:
                verbosity('Actualizando grado de progreso...', tl=verb_tl+1)
                df = pd.DataFrame({'id_user': [id_user], 'id_course': [id_course],
                                'progress_percent': [str(progress_rate)]})
                update_data(connection_element, 'users_courses_table', 'progress_percent', df)
                verbosity('Grado de progreso actualizado.', tl=verb_tl+1)
            else:
                verbosity('Grado de progreso ya actualizado.', tl=verb_tl+1)
    
    return progress_rate

def obtain_percentages_module_results(connection_element, id_user: int, id_course: int):
    '''
    ...
    v1.0.0
    '''
    # - Make preliminar validations
    user_exists = check_existence_of_field_and_value(connection_element,
                                    'users_table', 'id_user', id_user)
    if not user_exists:
        raise ValueError('No existe el usuario en base de datos')


    course_exists = check_existence_of_field_and_value(connection_element,
                                    'course_table', 'id_course', id_course)
    if not course_exists:
        raise ValueError('No existe el curso en base de datos')

    user_studying_course = check_existence_of_field_and_value(connection_element,
                                    'user_submodule_progress', 'id_user', id_user)
    if not user_studying_course:
        raise ValueError('El usuario no esta estudiando el curso')

    # - Get course modules
    df_modules = consult_data_by_fields(connection_element,
                                        'module_table',
                                        ('id_module', 'module_title'),
                                        where=f'id_course={id_course}'
                                        )
    modules_percents = []

    # - Advance percent by module
    for id_module in df_modules['id_module']:

        # - Consult submodules for module
        ans = consult_data_by_fields(connection_element,
                                                'submodule_table',
                                                'id_submodule',
                                                where=f'id_module={id_module}'
                                                )
        ids_submodules = ans['id_submodule']

        # - Consult submodule progresses
        sent_where = f'id_submodule IN ({",".join([str(sb) for sb in ids_submodules])})'
        sent_where += f' AND id_user={id_user}'
        df_submodules_progress = consult_data_by_fields(connection_element,
                                                        'user_submodule_progress',
                                                        where = sent_where
                                                        )

        if len(df_submodules_progress) == 0:
            module_percent = 0
        else:
            df_submodules_progress.sort_values('id_submodule', inplace=True)
            submodules_percents = [0]*len(ids_submodules)
            db_submodules_percents = list(df_submodules_progress['success_rate'].values)
            db_submodules_percents = db_submodules_percents + [0]*(len(ids_submodules) - len(db_submodules_percents))
            
            module_percent = sum(db_submodules_percents)//len(db_submodules_percents)

        modules_percents.append(module_percent)
        
    return list(df_modules['module_title'].values), modules_percents

def generate_progress_chart(xlabels, values, font_paths, path_to_save):
    '''
    ...
    v1.0.0
    '''
    
    # - Add fonts
    for font_path in font_paths:
        font_manager.fontManager.addfont(font_path)

    # - Bar colors
    colors = '#2F0084', '#00DE97'
    bar_colors = [colors[i % len(colors)] for i in range(len(values))]

    # - Create figure and plot data
    fig, ax = plt.subplots(figsize=(10, 5))
    ax.bar(xlabels, values, color=bar_colors, width=0.3)

    # - Set properties
    # -- Title
    ax.set_title('Porcentaje de resultados', fontname='Lato',
                 color='#2F0084', fontsize=20, pad=20)
    # -- Limit y to 0-100, change font and add % symbol
    ax.set_ylim(0,100)
    plt.yticks(fontname="Roboto")
    ax.yaxis.set_major_formatter(FuncFormatter(lambda x, pos: '%1.0f%%' % (x)))
    # -- Grid
    ax.grid(axis='y', lw=0.3, ls='--')
    ax.set_axisbelow(True)
    # -- Ticks
    ax.tick_params(axis='x', length=0, labelcolor='#A1A1A1')
    ax.tick_params(axis='y', length=0, labelcolor='#31394D')
    # -- Borders
    for border in ('top', 'bottom', 'left', 'right'):
        ax.spines[border].set_linestyle('-.')
        ax.spines[border].set_edgecolor('#CCCCCC')

    plt.tight_layout()
    plt.savefig(path_to_save, dpi=200, format='png')
