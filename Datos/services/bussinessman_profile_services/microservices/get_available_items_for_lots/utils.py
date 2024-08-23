import psycopg2
from shared.utils import verbosity
from shared.db_utils import consult_data, consult_table_data_as_dict, get_number_of_rows_in_table
from services.bussinessman_profile_services.shared.common_ms_funcs import get_farm_location

def validate_minimum_number_of_lots(connection_element, minimum_number: int = 2):
    number_of_rows = get_number_of_rows_in_table(connection_element, 'lot_table')
    return number_of_rows >= minimum_number

def get_available_items_for_lots(dic_credentials):
    # - 
    connection = psycopg2.connect(**dic_credentials)

    # - Get dictionaries
    verbosity('Haciendo consultas...', tl=3)
    verbosity('Caracteristicas de cafe disponibles...', tl=4)
    dic_varieties = consult_table_data_as_dict(connection,'id_variety', 'coffee_variations_table')
    dic_profiles = consult_table_data_as_dict(connection,'id_profile', 'coffee_profile_table')
    dic_roastes = consult_table_data_as_dict(connection,'id_roast', 'roasting_type_table')

    # - Coffee properties
    available_ids_varieties = list(consult_data(connection, f'SELECT DISTINCT id_variety FROM lot_table;').flatten())
    available_ids_varieties.sort()
    available_ids_profiles = list(consult_data(connection, f'SELECT DISTINCT id_profile FROM lot_table;').flatten())
    available_ids_profiles.sort()
    available_ids_roastes = list(consult_data(connection, f'SELECT DISTINCT id_roast FROM lot_table;').flatten())
    available_ids_roastes.sort()

    # - Build dictionaries
    available_varieties = [{'id_variety': str(idd), 'variety_name':dic_varieties[str(idd)]['variety_name']}
                                    for idd in available_ids_varieties]
    available_profiles = [{'id_profile': str(idd), 'profile_name':dic_profiles[str(idd)]['profile_name']}
                                    for idd in available_ids_profiles]
    available_roastes = [{'id_roast': str(idd), 'roasting_name':dic_roastes[str(idd)]['roasting_name']}
                                    for idd in available_ids_roastes]
    dic_info = {
        'coffee_properties_info': {
            'available_varieties': available_varieties,
            'available_profiles': available_profiles,
            'available_roastes': available_roastes
        }
    }

    # - Locations
    verbosity('Departamentos disponibles...', tl=4)
    available_ids_farms = list(consult_data(connection, f'SELECT DISTINCT id_farm FROM lot_table;').flatten())
    available_ids_states = list(set([get_farm_location(connection, id_farm)[-1] for id_farm in available_ids_farms]))
    available_ids_states.sort()
    dic_states = consult_table_data_as_dict(connection, 'id_state', 'states_table')
    available_states = [{'id_state': str(idd), 'state_name':dic_states[str(idd)]['state_name']}
                                    for idd in available_ids_states]
    dic_info ['available_states'] = available_states

    # - Price range
    verbosity('Rango de precio disponible...', tl=4)

    min_price, max_price = consult_data(connection,
                                        'SELECT MIN(price_per_kilo), MAX(price_per_kilo) from lot_quantity').flatten()
    dic_info['available_price_range'] = {
        'min_price': min_price,
        'max_price': max_price
    }

    connection.close()

    return dic_info
