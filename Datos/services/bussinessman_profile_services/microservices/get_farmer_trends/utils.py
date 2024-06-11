import psycopg2
import pandas as pd
import numpy as np
from os import path
from shared.db_utils import consult_data, consult_data_by_fields
from shared.utils import verbosity
from services.bussinessman_profile_services.shared.common_ms_funcs import get_lot_information

def get_farmer_trends2(dic_credentials, num_persons: int):

    # - Establish connection with database
    connection = psycopg2.connect(**dic_credentials)
    
    # - Get purchases table and sort by role and lot
    verbosity('Consultando tabla de compras...', tl=3)
    purchase_status = (3,7,9,10)
    df_purchases = consult_data_by_fields(connection,
                                            'purchase_table','id_seller,id_buyer,id_lot,purchase_quantity'.split(','),
                                            f'id_purchase_status IN {purchase_status}')
    if len(df_purchases) < 2:
        raise IndexError('No hay suficientes datos para generar rankings.')
    else:
        ranking = []
        verbosity('Delimitando informacion de interes...', tl=3)
        sort_field, field_to_del = 'id_seller','id_buyer'
        del df_purchases[field_to_del]
        df_purchases.sort_values(by=[sort_field,'id_lot'], inplace=True)
        # - Group by role
        verbosity('Agrupando por vendedores...', tl=3)
        grouped = df_purchases.groupby(sort_field)
        ids_persons = grouped.groups.keys()
        # - Ranking
        df_ranking = pd.DataFrame({sort_field:ids_persons,
                                'purchase_quantity':[sum(grouped.get_group(k)['purchase_quantity']) for k in ids_persons]})
        df_ranking.sort_values('purchase_quantity', ascending=False, inplace=True)
        # - Limit ranking to first n_results
        verbosity('Limitando resultados...', tl=3)
        df_ranking = df_ranking[:num_persons]

        # - Traverse groups extracting stats
        verbosity('Obteniendo estadisticas...', tl=3)
        dic_persons = {}
        for id_person in df_ranking[sort_field]:
            sdf = grouped.get_group(id_person)

            # - Total quantity
            total_quantity = sum(sdf['purchase_quantity'])
            # - Name of person
            person_name = consult_data(connection,
                                    f'SELECT user_name FROM users_table WHERE id_user={id_person}').flatten()[0]
            user_profile_photo = consult_data(connection,
                                            f'SELECT user_profile_photo FROM users_table WHERE id_user={id_person}',).flatten()[0]
            # -- Group by lots
            df_pq = sdf.groupby('id_lot').sum()[['purchase_quantity']]
            df_pq.sort_values('purchase_quantity', ascending=False, inplace=True)
            # -- Add product details
            fields = 'id_lot,id_variety,id_profile,id_roast'
            ids_lots = list(df_pq.index)
            ddf = consult_data(connection, f'SELECT {fields} FROM lot_table WHERE id_lot IN ({str(ids_lots)[1:-1]})'
                            ,columns=fields.split(',')).set_index('id_lot')
            df_pq = pd.concat((df_pq,ddf),axis=1)

            # - Particular elements by role
            # - Score
            farmer_score = round(np.mean(consult_data(connection,f'SELECT score FROM score_users WHERE id_user={id_person}').flatten()))
            # - Farm name
            id_farm_mp = consult_data(connection,f'SELECT id_farm FROM lot_table WHERE id_lot={df_pq.index[0]}').flatten()[0]
            farm_name = consult_data(connection,f'SELECT farm_name FROM farms_table WHERE id_farm={id_farm_mp}').flatten()[0]
            elms = [farmer_score, farm_name]

            # - Save info
            dic_persons[id_person] = [total_quantity, df_pq] + [person_name, user_profile_photo] + elms


        # - Traverse persons info and get output data
        verbosity('Generando ranking...', tl=3)
        for id_person in dic_persons.keys():
            elms = dic_persons[id_person]
            total_quantity, df, user_name, user_profile_photo = elms[:4]
            
            # - Get best-seller cup profile info
            purch_quant, id_profile = df.iloc[0][['purchase_quantity', 'id_profile']].values
            profile_name = consult_data(connection, f'SELECT profile_name FROM coffee_profile_table where id_profile={id_profile}').flatten()[0]
            profile_purchase_percent = round(100*purch_quant/total_quantity,1)
            # - Output data
            ranking.append({
                'id_user': int(id_person),
                'user_name': user_name,
                'user_profile_photo': user_profile_photo,
                'score': int(elms[-2]),
                'farm_name': elms[-1],
                'best_seller_cup_profile': {
                    'profile_name': profile_name,
                    'percent': profile_purchase_percent
                }
            })

    connection.close()
    return ranking

def get_farmer_trends(dic_credentials, pref: str, num_persons: int):
    # - Establish connection with database
    connection = psycopg2.connect(**dic_credentials)

    # - Get purchases table and sort by role and lot
    verbosity('Consultando tabla de compras...', tl=3)
    purchase_status = (3,7,9,10)
    df_purchases = consult_data_by_fields(connection,
                                        'purchase_table','id_seller,id_lot,purchase_quantity'.split(','),
                                        f'id_purchase_status IN {purchase_status}')
    if len(df_purchases) < 2:
        raise IndexError('No hay suficientes datos para generar rankings.')
    else:
        ranking = []
        df_purchases.sort_values(by=['id_seller', 'id_lot'], inplace=True)

        # - General ranking
        # - Group by role
        verbosity('Agrupando por vendedores...', tl=3)
        grouped = df_purchases.groupby('id_seller')
        ids_persons = grouped.groups.keys()
        df_ranking = pd.DataFrame({'id_seller':ids_persons,
                                'purchase_quantity':[sum(grouped.get_group(k)['purchase_quantity']) for k in ids_persons]})
        df_ranking.sort_values('purchase_quantity', ascending=False, inplace=True)
        # - Limit ranking to first n_results
        verbosity('Limitando resultados...', tl=3)
        df_ranking = df_ranking[:num_persons]

        ranking = []
        verbosity('Calculando estadisticas por vendedor...', tl=3)
        for id_user, total_purchase_quantity in df_ranking.values:
            user_name, user_profile_photo = consult_data(connection,
                                            f'SELECT user_name, user_profile_photo FROM users_table WHERE id_user={id_user}').flatten()
            dic_user = {
                'id_user': int(id_user),
                'user_name': user_name,
                'total_purchase_quantity': int(total_purchase_quantity),
                'user_profile_photo': path.join(pref, user_profile_photo) 
            }
            # - Ranking of sales
            df_user_sales = grouped.get_group(id_user)
            sales_grouped = df_user_sales.groupby('id_lot')
            ids_lots = sales_grouped.groups.keys()
            df_lots_ranking = pd.DataFrame({'id_lot':ids_lots,
                                    'sales_quantity':[sum(sales_grouped.get_group(k)['purchase_quantity']) for k in ids_lots]})
            df_lots_ranking.sort_values('sales_quantity', ascending=False, inplace=True)

            lots = []
            for id_lot, sales_quantity in df_lots_ranking.values:
                # TODO LOT CODING
                dic_lot_info = get_lot_information(id_lot, connection, verb=False)
                dic_lot = {
                    'id_lot': int(dic_lot_info['id_lot']),
                    'lot_photo': path.join(pref, dic_lot_info['lot_photo']),
                    'variety_name': dic_lot_info['properties_info']['variety_name'],
                    'profile_name': dic_lot_info['properties_info']['profile_name'],
                    'roasting_name': dic_lot_info['properties_info']['roasting_name'],
                    'sales_quantity': int(sales_quantity)
                }
                lots.append(dic_lot)
            dic_user['lots'] = lots
            ranking.append(dic_user)
            
    connection.close()
    return ranking