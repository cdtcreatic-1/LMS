import pandas as pd
from shared.utils import verbosity

def get_geoinfo(entity_field, id_entity, path_csv):
    df = pd.read_csv(path_csv)
    df[entity_field] = df[entity_field].apply(int)
    df.set_index(entity_field, inplace=True)
    if not id_entity in df.index:
        raise ValueError('Id no encontrado')
    else:
        name, cx, cy, xmin, xmax, ymin, ymax = df.loc[id_entity].values
        dic = {
            'entity_name': name,
            'bbox': {
                'xmin': xmin,
                'xmax': xmax,
                'ymin': ymin,
                'ymax': ymax
            },
            'centroid': {
                'x': cx,
                'y': cy
            }
        }
        return dic

def get_geoinformation_from_polygon(id_state, id_city, id_village,
                                    path_csv_states_geoinfo,
                                    path_csv_cities_geoinfo,
                                    path_csv_villages_geoinfo,
                                    tl_ini=3
                                    ):

    if not id_state is None:
        verbosity('Busqueda de departamento', tl=tl_ini)
        dic_geoinfo = get_geoinfo('id_state', id_state, path_csv_states_geoinfo)
    elif not id_city is None:
        verbosity('Busqueda de municipio', tl=tl_ini)
        dic_geoinfo = get_geoinfo('id_city', id_city, path_csv_cities_geoinfo)
    elif not id_village is None:
        verbosity('Busqueda de vereda', tl=tl_ini)
        dic_geoinfo = get_geoinfo('id_village', id_village, path_csv_villages_geoinfo)

    return dic_geoinfo
