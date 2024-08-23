import json
from shared.db_utils import consult_data
from shared.utils import verbosity

def get_lot_coding(id_lot, connection_element, path_json_cities_codes):
    # - Get information
    fields = 'id_farm,id_variety,id_profile,id_roast'
    cons1 = consult_data(connection_element, f'SELECT {fields} FROM lot_table WHERE id_lot={id_lot}').flatten()
    if len(cons1) == 0:
        raise LookupError('provided id_lot not found in database')
    else:
        # - Features
        id_farm, id_variety, id_profile, id_roast = cons1
        # - Num of lot in farms
        farm_lots = consult_data(connection_element,f'SELECT id_lot FROM lot_table WHERE id_farm={id_farm}').flatten().tolist()
        num_lot = farm_lots.index(id_lot) + 1
        # - Provider and origin city
        id_user, id_village = consult_data(connection_element, f'SELECT id_user,id_village FROM farms_table WHERE id_farm={id_farm}').flatten()
        id_city = consult_data(connection_element,f'SELECT id_city FROM villages_table WHERE id_village={id_village}').flatten()[0]
        # - Coding components
        # - Category
        category = 'AG1' # Coffee
        # - Origin
        dic_geoinfo = json.load(open(path_json_cities_codes))
        origin = f'{dic_geoinfo[str(id_city)]["city_code"]}'
        # - Features
        features = f'V{id_variety}P{id_profile}T{id_roast}'
        # - Provider
        num_provider = f'{id_user}N{num_lot}'
        # - Code
        lot_coding = f'{category}-{origin}-{features}-{num_provider}'

    return lot_coding
