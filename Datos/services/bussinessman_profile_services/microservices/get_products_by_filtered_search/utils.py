from typing_extensions import Dict
import psycopg2

from services.bussinessman_profile_services.shared.common_ms_funcs import get_farm_location, get_lot_information
from shared.db_utils import consult_data, consult_data_by_fields
from shared.utils import verbosity


def get_products_by_filtered_search(dic_data: Dict, connection_element):

    # - Join lot 
    fields = 'lot_table.id_lot, id_variety, id_profile, id_roast, price_per_kilo, id_farm'
    query = f'SELECT {fields} ' + \
            'FROM lot_table JOIN lot_quantity ON lot_table.id_lot = lot_quantity.id_lot'

    conditions = []
    verbosity('Integrando filtros de busqueda...', tl=3)

    # - Filter by properties
    lot_properties = dic_data['lot_properties']
    if lot_properties["id_variety"] is not None:
        verbosity('variedad', tl=4)
        ids_variety = lot_properties["id_variety"]
        conditions.append(f'id_variety IN ({", ".join(str(e) for e in ids_variety)})')

    if lot_properties["id_profile"] is not None:
        verbosity('perfil de taza', tl=4)
        ids_variety = lot_properties["id_profile"]
        conditions.append(f'id_profile IN ({", ".join(str(e) for e in ids_variety)})')

    if lot_properties["id_roast"] is not None:
        verbosity('tipo de tostion', tl=4)
        ids_variety = lot_properties["id_roast"]
        conditions.append(f'id_roast IN ({", ".join(str(e) for e in ids_variety)})')

    # - Filter by price
    min_price, max_price = dic_data['price_range'].values()
    if [min_price, max_price] != [None]*2:
        if max_price is None:
            verbosity('precio minimo', tl=4)
            conditions.append(f'price_per_kilo > {min_price}')
        elif min_price is None:
            verbosity('precio maximo', tl=4)
            conditions.append(f'price_per_kilo < {max_price}')
        else:
            conditions.append(f'price_per_kilo BETWEEN {min_price} AND {max_price}')

    conditions = ' AND '.join(conditions)
    if len(conditions) > 0:
        query += f' WHERE {conditions}'
    verbosity('Haciendo consultas...', tl=3)
    df = consult_data(connection_element, query, columns=fields.split(', '))
    df.rename(columns={'lot_table.id_lot': 'id_lot'}, inplace=True)

    # - State
    if dic_data['id_state'] is not None:
        ids_state = dic_data['id_state']
        # - Check other filters
        if not(('lot_properties' in dic_data) or ('price_range' in dic_data)) or df.empty:
            df = consult_data_by_fields(connection_element, 'lot_table', ('id_lot','id_farm'))
        # - Get states
        df['id_state'] = [get_farm_location(connection_element, id_farm)[-1] for id_farm in df['id_farm']]
        # - Filter
        df = df[df['id_state'].isin(ids_state)]
    
    if df.empty:
        verbosity('No hay resultados para los filtros recibidos...', tl=4)
        dics_info = []
    else:
        ids_lots = [int(id_lot) for id_lot in df['id_lot'].to_list()]
        verbosity(f'{len(ids_lots)} lotes encontrados...', tl=4, level='cyan')
        dics_info = []
        for id_lot in ids_lots:
            verbosity('', pref='', prompt='')
            verbosity(f'id_lot: {id_lot}', tl=4)
            dics_info.append(get_lot_information(id_lot, connection_element, tl_ini=5))
        verbosity(f'{len(ids_lots)} lotes encontrados...', tl=4, level='cyan')

    return dics_info
