import psycopg2
import pandas as pd
import matplotlib.pyplot as plt
from os import path
from matplotlib.patches import Circle
from os import path, mkdir

from shared.db_utils import consult_data, consult_data_by_fields
from shared.utils import verbosity

def get_businessmen_trends(dic_credentials, pref:str, num_persons: int):

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
        sort_field, field_to_del = 'id_buyer','id_seller'
        del df_purchases[field_to_del]
        df_purchases.sort_values(by=[sort_field,'id_lot'], inplace=True)
        # - Group by role
        verbosity('Agrupando por compradores...', tl=3)
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
            elms = []
            # - Save info
            dic_persons[id_person] = [total_quantity, df_pq] + [person_name, user_profile_photo] + elms

        # - Supplies for buyer role
        dic_cup_profiles = {k:v for k,v in consult_data_by_fields(connection, 'coffee_profile_table', ('id_profile','profile_name')).values}
        dic_cup_profiles.update({'-1':'Otros'})
        dic_varieties = {k:v for k,v in consult_data_by_fields(connection, 'coffee_variations_table', ('id_variety','variety_name')).values}
        dic_varieties.update({'-1':'Otros'})
        dic_roasting_type = {k:v for k,v in consult_data_by_fields(connection, 'roasting_type_table', ('id_roast','roasting_name')).values}
        dic_roasting_type.update({'-1':'Otros'})

        # - Traverse persons info and get output data
        verbosity('Generando ranking...', tl=3)
        for id_person in dic_persons.keys():
            elms = dic_persons[id_person]
            total_quantity, df, user_name, user_profile_photo = elms[:4]
            # - Get buyer stats
            num_fts = 3
            dic_stats = {'total_quantity': total_quantity}
            for feature, dic_eq_ft in zip(('id_variety','id_profile','id_roast'),
                                        (dic_varieties, dic_cup_profiles, dic_roasting_type)):
                items = []
                df_pq = df.groupby(feature).sum()[['purchase_quantity']].sort_values('purchase_quantity', ascending=False)
                # - Limit to num of features
                if len(df_pq) > num_fts:
                    tdf = df_pq[:num_fts].copy()
                    # - Gropu rest of features
                    tdf.loc[-1] = [sum(df_pq[num_fts:]['purchase_quantity'])]
                    df_pq = tdf
                # - Quantities and relative percents
                dic_quantities = df_pq.to_dict(orient='dict')['purchase_quantity']
                dic_percents = {str(k):round(100*v/total_quantity,1) for k,v in df_pq['purchase_quantity'].to_dict().items()}
                # - Dictionary of details
                dic_ft, cont = {}, 0
                for k in dic_percents.keys():
                    items.append({
                        'name': dic_eq_ft[k],
                        'quantity': dic_quantities[int(k)],
                        'percent': dic_percents[k]
                    })
                dic_stats[feature.split('_')[1]] = items

                # - Add colors
                varieties_colors = ['#460387', '#75088F', '#971088', '#A01666']
                profiles_colors = ['#01DE98' ,'#012EE7' ,'#0180E2' ,'#01D5E2']
                colors = varieties_colors + profiles_colors
                dic_roasting_type_colors = {'Tueste claro':'#ffffc7', 'Tueste medio':'#ddc88f',
                                            'Tueste medio oscuro':'#b9935a', 'Tueste oscuro':'#82612d', 'Otros': '#4e3300'}
                p_color = 0
                for ft in list(dic_stats.keys())[1:]:
                    items = dic_stats[ft]
                    for item in items:
                        pass
                        if ft == 'roast':
                            item['color'] = dic_roasting_type_colors[item['name']]
                        else:
                            item['color'] = colors[p_color]
                            p_color += 1

            # - Output data
            ranking.append({
                'id_user': int(id_person),
                'user_name': user_name,
                'user_profile_photo': path.join(pref, elms[3]),
                'stats': dic_stats
                })
    connection.close()
    return ranking

def generate_feature_chart(percents, colors, circle_color='#E7E7E7'):
        fig, ax = plt.subplots(figsize=[5]*2)
        circle = Circle((0, 0), radius=1, facecolor=circle_color)
        ax.add_patch(circle)
        _ = ax.pie(percents,radius=0.9,colors=colors,wedgeprops=dict(width=0.2,ec=circle_color,lw=10))
        ax.axis('equal')

        return fig

def get_pie_charts_buyer_stats(dic_info, pref:str, output_dir='./generated_charts', ):
    # - Create path
    if not path.isdir(output_dir):
       mkdir(output_dir)

    dic_paths = {}
    # - Generate figures by feature
    for feature in list(dic_info['stats'].keys())[1:]:
        # - Get info
        percents = [d['percent'] for d in dic_info['stats'][feature]]
        colors = [d['color'] for d in dic_info['stats'][feature]]
        # - Generate and save figure
        fig = generate_feature_chart(percents, colors)
        fname = path.join(output_dir,f'stats_{dic_info["id_user"]}_{feature}.png')
        _ = fig.savefig(fname, bbox_inches='tight', dpi=250)
        plt.close()
        dic_paths[f'chart_{feature}_path'] = path.join(pref, 'charts',f'stats_{dic_info["id_user"]}_{feature}.png')
    return dic_paths

def generate_charts(ranking, pref):
    for dic_info in ranking:
        id_person = dic_info['id_user']
        dic_paths = get_pie_charts_buyer_stats(dic_info, pref)
        for dic_person in ranking:
            if id_person == dic_person['id_user']:
                dic_person['chart_paths'] = {}
                for k in dic_paths.keys():  
                    dic_person['chart_paths'][k] = dic_paths[k]
