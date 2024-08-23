import json
import rasterio
from shared.utils import verbosity
from shared.db_utils import consult_data

def get_raster_value_from_coordinate(raster_path, longitude, latitude):
    '''
    v1.0.0
    '''
    # - Read raster and extract elements
    # -- Dataset
    with rasterio.open(raster_path) as ds:
        # -- Bounds
        x1, x2, y1, y2 = ds.bounds
        # - Verify if coordinate is within raster extends
        in_xextends = x1 <= longitude and longitude <= x2
        in_yexntends = y1 <= latitude and latitude <= y2

        if in_xextends and in_yexntends:
            value = list(ds.sample([(longitude, latitude)]))[0][0]
            return value
        else:
            return None
        
def get_entities_ids_from_id_village(connection_element, id_village, tl_ini=3):

    verbosity('Consultando informacion para vereda', tl=tl_ini)
    # - Construct sentence

    sent = 'SELECT states_table.id_state, cities_table.id_city, villages_table.id_village'
    sent += ', states_table.state_name, cities_table.city_name, villages_table.village_name'
    sent += ' FROM villages_table'
    sent += ' JOIN cities_table ON villages_table.id_city = cities_table.id_city'
    sent += ' JOIN states_table ON states_table.id_state = cities_table.id_state '
    sent += f' WHERE id_village={id_village}'
    # - Do consult
    ans = consult_data(connection_element, sent)

    return list(ans.flatten())

def get_entities_ids_from_coordinate(connection_element,
                                     longitude, latitude,
                                     village_ids_raster_path,
                                     city_ids_raster_path,
                                     tl_ini=3
                                     ):
    # - Get id_village from corresponding raster
    verbosity('Identificando vereda...', tl=tl_ini)
    id_village = get_raster_value_from_coordinate(village_ids_raster_path, longitude, latitude)
    if id_village is None:
        raise ValueError('Coordenada por fuera del territorio colombiano')
    else:
        if id_village == 0:
            # - Verifiy 
            id_city = get_raster_value_from_coordinate(city_ids_raster_path, longitude, latitude)
            if id_city == 0:
                raise ValueError('Coordenada por fuera del territorio colombiano')
            else:
                verbosity('Coordenada proporcionada cae en ciudad capital o cabecera municipal',
                          tl=tl_ini+2, level='cyan')
                id_state = consult_data(connection_element,
                                        f'SELECT id_state from cities_table where id_city={id_city}'
                                        ).flatten()[0]
                id_village = -99
        else:
            verbosity(f'id_village = {int(id_village)}', tl=tl_ini+1, level='cyan')
            ans = get_entities_ids_from_id_village(connection_element, id_village)
            ids_entities, names_entities = ans[:3], ans[3:]
            verbosity(names_entities, tl=tl_ini+1, level='cyan')
            id_state, id_city, id_village = ids_entities
    id_state, id_city, id_village = map(int, (id_state, id_city, id_village))

    return {
        'id_state': id_state,
        'id_city': id_city,
        'id_village': id_village
        }
