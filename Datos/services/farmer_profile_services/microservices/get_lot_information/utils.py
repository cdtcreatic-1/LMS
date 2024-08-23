from os import path
from shared.db_utils import consult_data, consult_data_by_fields
from shared.utils import verbosity

def get_farm_location(connection_element, id_farm: int | str):
    '''
    v.1.0.0
    '''

    id_village, id_city, id_state = [None]*3
    # - Village
    resp1 = consult_data(connection_element, f'SELECT id_village FROM farms_table WHERE id_farm = {id_farm}').flatten()
    if len(resp1)> 0:
        id_village = resp1[0]
        # - City
        resp2 = consult_data(connection_element, f'SELECT id_city FROM villages_table WHERE id_village = {id_village}').flatten()
        if len(resp2)> 0:
            id_city = resp2[0]
            # - City
            resp3 = consult_data(connection_element, f'SELECT id_state FROM cities_table WHERE id_city = {id_city}').flatten()
            if len(resp2)> 0:
                id_state = resp3[0]

    return id_village, id_city, id_state

def get_lot_information(id_lot: int | str, connection_element, url_pref: str = '', tl_ini=4, verb: bool = True):
    '''
    v.1.0.0
    '''

    verbosity('Consultando informacion...', tl=tl_ini, verb=verb)
    # - Data from main table
    verbosity('Datos de tabla principal...', tl=tl_ini+1, verb=verb)
    dic1 = consult_data_by_fields(connection_element, 'lot_table',
                        ('id_farm','lot_number', 'id_variety', 'id_profile', 'id_roast'),
                        f'id_lot={id_lot}').to_dict(orient='records')[0]
    # - Farm
    verbosity('Datos de finca...', tl=tl_ini+1, verb=verb)
    dic2 = consult_data_by_fields(connection_element, 'farms_table',
                        ('id_user','farm_name'),
                        f'id_farm = {dic1["id_farm"]}').to_dict(orient='records')[0]

    # - Photo
    dic3 = consult_data_by_fields(connection_element, 'lot_photo', ['lot_photo'],
                        f'id_lot={id_lot}').to_dict(orient='records')[0]
    
    # - Quantity
    dic4 = consult_data_by_fields(connection_element, 'lot_quantity',
                        ('total_quantity', 'samples_quantity', 'price_per_kilo'),
                        f'id_lot={id_lot}').to_dict(orient='records')[0]

    # - Owner info
    verbosity('Datos de propietario...', tl=tl_ini+1, verb=verb)
    owner_name = consult_data(connection_element,
                                f'SELECT user_name from users_table where id_user={dic2["id_user"]}').flatten()[0]

    # - Properties info
    verbosity('Datos de propiedades del producto...', tl=tl_ini+1, verb=verb)
    variety_name = consult_data(connection_element,
                                f'SELECT variety_name from coffee_variations_table where id_variety={dic1["id_variety"]}').flatten()[0]
    profile_name = consult_data(connection_element,
                                f'SELECT profile_name from coffee_profile_table where id_profile={dic1["id_profile"]}').flatten()[0]
    roasting_name = consult_data(connection_element,
                                f'SELECT roasting_name from roasting_type_table where id_roast={dic1["id_roast"]}').flatten()[0]

    # - Location info
    verbosity('Datos de ubicacion...', tl=tl_ini+1, verb=verb)
    id_village, id_city, id_state = get_farm_location(connection_element, dic1['id_farm'])
    village_name = consult_data(connection_element,
                                f'SELECT village_name from villages_table where id_village={id_village}').flatten()[0]
    city_name = consult_data(connection_element,
                                f'SELECT city_name from cities_table where id_city={id_city}').flatten()[0]
    state_name = consult_data(connection_element,
                                f'SELECT state_name from states_table where id_state={id_state}').flatten()[0]

    # - Build dic info
    verbosity('Consolidando informacion...', tl=tl_ini, verb=verb)
    dic_info = {
        'id_lot': str(id_lot),
        'lot_number': dic1['lot_number'],
        'lot_photo': path.join(url_pref, dic3['lot_photo'])
    }

    dic_info['owner_info'] = {
        'id_user': str(dic2['id_user']),
        'user_name': owner_name
    }

    dic_info['farm_info'] = {
        'id_farm': str(dic1['id_farm']),
        'farm_name': dic2['farm_name']
    }

    dic_info['properties_info'] = {
        'id_variety': str(dic1['id_variety']),
        'variety_name': variety_name,
        'id_profile': str(dic1['id_profile']),
        'profile_name': profile_name,
        'id_roast': str(dic1['id_roast']),
        'roasting_name': roasting_name
    }

    dic_info['location_info'] = {
        'id_village': str(id_village),
        'village_name': village_name,
        'id_city': str(id_city),
        'city_name': city_name,
        'id_state': str(id_state),
        'state_name': state_name
    }

    dic_info['quantity_info'] = dic4
    
    return dic_info
