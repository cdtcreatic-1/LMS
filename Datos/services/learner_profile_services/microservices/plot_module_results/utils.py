import matplotlib.pyplot as plt
import matplotlib.font_manager as font_manager
from matplotlib.ticker import FuncFormatter

from shared.db_utils import check_existence_of_field_and_value, consult_data_by_fields

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
        a = consult_data_by_fields(connection_element,
                                                'submodule_table',
                                                'id_submodule',
                                                where=f'id_module={id_module}'
                                                )
        ids_submodules = a['id_submodule']

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
