from shared.db_utils import consult_data_by_fields, check_existence_of_field_and_value
from shared.utils import verbosity

def get_villages_parents(connection_element, id_village: int):
    '''
    Get village info
    v1.0.0
    '''

    village_name, id_city = consult_data_by_fields(connection_element,
                                                    'villages_table',
                                                    ('village_name','id_city'),
                                                    f'id_village={id_village}').values[0]

    city_name, id_state = consult_data_by_fields(connection_element,
                                                    'cities_table',
                                                    ('city_name', 'id_state'),
                                                    f'id_city={id_city}').values[0]
    state_name = consult_data_by_fields(connection_element,
                                        'states_table',
                                        ('state_name',),
                                        f'id_state={id_state}'
                                        ).values.flatten()[0]
    
    return {
        'village_name': village_name,
        'id_city': id_city,
        'city_name': city_name,
        'id_state': id_state,
        'state_name': state_name
        }

def get_farm_info(connection_element, id_farm):
    # - Farm info
    fields = ('id_user', 'id_village', 'id_farm', 'farm_number_lots',
            'farm_name', 'name_provided_by_user', 'farm_status')
    verbosity(f'Consultando informacion basica...', tl= 3)
    df_farm = consult_data_by_fields(connection_element,
                                    'farms_table',
                                    fields,
                                    f'id_farm={id_farm}'
                                    )

    dic_farm = df_farm.to_dict(orient='records')[0]
    # - Additional info
    verbosity(f'Consultando informacion adicional...', tl= 3)
    dic_farm_ad = consult_data_by_fields(connection_element,
                                    'farms_additional_info',
                                    ('altitude', 'climate', 'temperature'),
                                    f'id_farm={id_farm}'
                                    ).to_dict(orient='records')[0]
    dic_farm.update(dic_farm_ad)
    # - Village info
    verbosity(f'Consultando informacion de vereda...', tl= 3)
    id_village = dic_farm['id_village']
    dic_village = get_villages_parents(connection_element, id_village)
    dic_farm.update(dic_village)
    # -- Validate village name
    if dic_farm['name_provided_by_user'] is not None:
        dic_farm['village_name'] = dic_farm['name_provided_by_user']

    # - Conditioning int values
    for k in dic_farm.keys():
        try:
            if isinstance(dic_farm[k], bool):
                continue
            else:
                dic_farm[k] = int(dic_farm[k])
        except:
            continue

    # - Lots
    # -- Lots that belongs to farm
    ids_lots = consult_data_by_fields(connection_element,
                        'lot_table',
                        'id_lot',
                        f'id_farm={id_farm}'
                        ).values.flatten()
    
    if len(ids_lots) == 0:
        is_in_purchase = False
    else:
        # -- Check existence of any lot in cart_table
        df = consult_data_by_fields(
            connection_element,
            'cart_table',
            'is_in_purchase',
            f'id_lot IN ({", ".join([str(id_lot) for id_lot in ids_lots])})'
            )
        # -- Check is_in_purchase
        if df.empty:
            is_in_purchase = False
        else:
            if True in df['is_in_purchase']:
                is_in_purchase = True
            else:
                is_in_purchase = False
    dic_farm['is_in_purchase'] = is_in_purchase

    return dic_farm

def get_farms_from_user(connection_element, id_user):
    # - User's farms
    ids_farms = consult_data_by_fields(connection_element,
                        'farms_table',
                        'id_farm',
                        f'id_user={id_user}').values.flatten()
    # - Get info from each farm
    farms_info = []
    for id_farm in ids_farms:
        dic_farm = get_farm_info(connection_element, id_farm)
        # - Filter by farm_status
        if dic_farm['farm_status']:
            farms_info.append(dic_farm)
        else:
            continue
    return farms_info