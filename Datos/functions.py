from typing_extensions import Sequence, Callable, Dict, Any
import json
import rasterio
import geopandas as gpd
from shapely.geometry import Point
from os import path, mkdir
import requests
from bs4 import BeautifulSoup
import math
import pandas as pd
import pickle
import numpy as np
import random
import psycopg2
import matplotlib.pyplot as plt
from matplotlib.patches import Circle
from scipy.sparse import csr_matrix
from scipy.sparse import find as find_csr_matrix
from sklearn.neighbors import NearestNeighbors
from os import getenv

from functions_db import *
from shared.utils import verbosity

path_json_geoinformation = './supplies/geodata/colombia_polygons_geoinformation.json'
path_json_cities_codes = './supplies/colombia_cities_codes.json'
altitude_raster_path = './supplies/geodata/colombia_altitude_1000.tif'
temperature_raster_path = './supplies/geodata/colombia_temperature.tif'
climate_raster_path = './supplies/geodata/colombia_climate.tif'
path_village_ids_raster = './supplies/geodata/colombia_village_ids_004225.tif'
path_city_ids_raster = './supplies/geodata/colombia_city_ids_009.tif'
path_json_deptos_geoinfo = './supplies/geodata/deptos_extends.json'
path_json_mpos_geoinfo = './supplies/geodata/mpos_extends.json'
path_json_vdas_geoinfo = './supplies/geodata/vdas_extends.json'
# - Product recommendation engine model
path_recommendations_engine_model = './supplies/models/model_recommended_engine_knn.sav'

dic_credentials = {
            'dbname': getenv('POSTGRES_INITDB_DATABASE'),
            'user': getenv('POSTGRES_INITDB_USERNAME'),
            'password': getenv('POSTGRES_INITDB_PASSWORD'),
            'host': getenv('POSTGRES_INITDB_HOST'),
            'port': getenv('POSTGRES_INITDB_PORT'),
            }

# --- GENERAL FUNCTIONS ---

def verbosity2(info, verb=True):
        if verb:
            print(info)

def get_entities_ids_from_id_village(ref_geoinfo, id_village):
    # - Validate dictionary
    dic_geoinfo = ref_geoinfo if isinstance(ref_geoinfo, dict) else json.load(open(ref_geoinfo))
    # - Initialize ids
    id_state, id_city = [None]*2
    id_village = str(id_village)
    # - Search
    for id_s in dic_geoinfo.keys():
        if id_state is None:
            for id_c in dic_geoinfo[id_s]['cities'].keys():
                if id_village in dic_geoinfo[id_s]['cities'][id_c]['villages'].keys():
                    id_state, id_city= id_s, id_c
                    break
        else:
            break
    return id_state, id_city, id_village

# ---------- RASTER VALUE FROM COORDINATE ----------
def get_raster_value_from_coordinate(raster_path, lon, lat):
    # - Read raster and extract elements
    # -- Dataset
    with rasterio.open(raster_path) as ds: 
        # -- Geotransform
        dx, _, x0, _, dy, y0 = ds.transform[:6]
        # -- Data array
        array = ds.read(1)
        X,Y = array.shape

    # - Find positions, validate and extract value
    # -- Row
    for i in range(0,Y+1):
        if (y0 + i*dy) < lat:
            i -= 1
            break
    # -- Column
    if i < X:
        for j in range(0,X+1):
            if (x0 + j*dx) > lon:
                j -= 1
                break
        if j < Y:
            return array[i,j]
        else:
            return -99
    else:
        return -99
    
def get_information_from_coordinate(input_data):
    # - Encodings
    # -- Mean temperature value encodings
    dic_temperature_codif = {
        0: -99,
        1 : '< 8 °C',
        2 : '8 - 12 °C',
        3 : '12 a 16 °C',
        4 : '16 a 20 °C',
        5 : '20 a 22 °C',
        6 : '22 a 24 °C',
        7 : '24 a 26 °C',
        8 : '26 a 28 °C',
        9 : '> 28',
        -99: -99
    }
    # -- Climates values encodings
    dic_climate_codif = {
        0: -99,
        1 : 'Desértico',
        2 : 'Árido',
        3 : 'Semiárido',
        4 : 'Semihúmedo',
        5 : 'Húmedo',
        6 : 'Superhúmedo',
        -99: -99
    }

    # - Coordinates
    _, longitude, latitude = input_data.values()
    # - Get output data
    altitude = get_raster_value_from_coordinate(altitude_raster_path, longitude, latitude)
    cod_temperature = get_raster_value_from_coordinate(temperature_raster_path, longitude, latitude)
    temperature = dic_temperature_codif[cod_temperature]
    cod_climate = get_raster_value_from_coordinate(climate_raster_path, longitude, latitude)
    climate = dic_climate_codif[cod_climate]

    output_data = {
        'altitude': int(altitude),
        'temperature': temperature,
        'climate': climate
    }

    return output_data

# ---------- GEOINFORMATION FROM POLYGON ----------
def get_geoinformation_from_polygon(input_data):
    # - Read and conditioning input data
    conditioning_id = lambda s: str(s) if s is not None else None
    _, id_state, id_city, id_village = [conditioning_id(v) for v in input_data.values()]
    # - Get information
    # -- Geoinformation for state
    if id_state is not None:
        verbosity(f'Busqueda por departamento')
        output_data = json.load(open(path_json_deptos_geoinfo))[id_state]
    else:
        verbosity(f'Busqueda por municipio')
        # -- Geoinformation for city
        if id_city is not None:
            output_data = json.load(open(path_json_mpos_geoinfo))[id_city]

        # -- Geoinformation for village
        else:
            verbosity(f'Busqueda por vereda')
            output_data = json.load(open(path_json_vdas_geoinfo))[id_village]

    verbosity([round(c,5) for c in output_data['centroid'].values()])
    return output_data

# ---------- ENTITIES IDs FROM COORDINATE ----------
def get_entities_ids_from_coordinate(input_data):
    # - Load geoinformation json for ids
    dic_geoinfo = json.load(open(path_json_geoinformation))
    # - Coordinates
    longitude, latitude = [input_data[k] for k in ('longitude', 'latitude')]
    # - Get id_village from corresponding raster
    id_village = int(get_raster_value_from_coordinate(path_village_ids_raster,longitude, latitude))
    # - Evaluate cases
    # -- All ok 
    if id_village > 0:
        id_state, id_city, id_village = get_entities_ids_from_id_village(dic_geoinfo,id_village)
    else:
        # -- Departmental or municipal capital
        if id_village == 0:
            id_village = -99
            id_city = int(get_raster_value_from_coordinate(path_city_ids_raster,longitude, latitude))
            for id_state in dic_geoinfo.keys():
                if str(id_city) in dic_geoinfo[id_state]['cities'].keys():
                    break
        # -- Off-map coordinates
        else:
            id_state, id_city, id_village = [-99]*3
            
    output_data = {
        'id_state': int(id_state),
        'id_city': int(id_city),
        'id_village': int(id_village)
        }

    return output_data

# ---------- COFFEE PRICE RECOMMENDATION ----------
def get_colombian_price_milds():
    url_reference_coffee_price = 'https://www.larepublica.co/indicadores-economicos/commodities/cafe/'
    response = requests.get(url_reference_coffee_price)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser') 
        # - Extract price
        description = soup.find_all(class_='price')[0].text
        description = description.split(' ')[1]
        coffee_colombian_milds = description.replace('.','')
        len_coffee_colombian_milds = len(coffee_colombian_milds)
        if(len_coffee_colombian_milds<=4):
            coffee_colombian_milds = float(coffee_colombian_milds.replace(',','.'))
            return coffee_colombian_milds
        else: 
            coffee_colombian_milds = float(coffee_colombian_milds.replace(',','.'))
            coffee_colombian_milds = (coffee_colombian_milds/(1*10**(len_coffee_colombian_milds - 4)))
            return coffee_colombian_milds
    else:
        return None

def get_dollar_value():
    url_reference_dollar_value = 'https://www.larepublica.co/indicadores-economicos/mercado-cambiario/dolar'
    response = requests.get(url_reference_dollar_value)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        # - Extract value
        description = soup.find_all(class_='price')[0].text
        description = description.split(' ')[1]
        usd_value = float(description.replace('.','').replace(',','.'))

        return usd_value
    else:
        return None
    
def higher_price_calculator(variety_name):
    coefficients_dict = {
        'Score': 0.077,
        'Countries': 
            {
                'Colombia': -0.145,
            },
        'Varieties': 
            {
                'Catuai': -0.056,
                'Caturra': 0.049,
                'Typica': -0.002,
                'Pacamara': 0.158,
                'other': 0.002,
            },
    }

    variety_name = variety_name if variety_name in coefficients_dict['Varieties'].keys() else 'other'

    price = get_colombian_price_milds()
    # if (coffee_values['Score'] > 87):
    price = price + (coefficients_dict['Score'])
    price = price + (coefficients_dict['Varieties'][variety_name])
    price = price + (coefficients_dict['Countries']['Colombia'])
    return pow(math.e, price)

def get_coffee_recommended_prices(input_data):
    # - Get variety name
    variety_name = input_data['variety_name']
    # - Get dollar value and colombian coffee milds
    usd_value = get_dollar_value()
    colombian_coffee_milds = get_colombian_price_milds()

    # - Get recommended prices
    # -- Lower price
    lower_price = colombian_coffee_milds * usd_value
    # -- Higher price
    higher_price = higher_price_calculator(variety_name)
    higher_price = higher_price*usd_value
    # -- Recommended price
    recommended_price = higher_price * 0.5

    output_data = {
        'lower_price' : round(lower_price,2)*2,
        'recommended_price' : round(recommended_price,2)*2,
        'higher_price' : round(higher_price,2)*2
    }

    return output_data

# ----- LOTS RECOMMENDATION ENGINE ---------

def data_to_csr_matrix(dataset, verb=False):
    """Create a csr matrix 

    Args:
        dataset (_type_): _description_

    Returns:
        _type_: _description_
    """
    n_items = dataset['id_lot'].max()
    n_users = dataset['id_user'].max()
    verbosity2('n_items:\n{0}'.format(n_items), verb)
    A = np.zeros((n_users + 1, n_items + 1))

    
    for line in dataset.itertuples():
        A[line[1],line[2]] = line[3]
    
    return csr_matrix(A)

def get_model_recommended_engine(model_path):
    model = pickle.load(open(model_path, 'rb'))
    return model
    
def train_model_recommended_engine(csr_dataset, model_path):
    '''
        # Get Trained model
        Get a trained model to recommend coffees for each user
        ## Args: 
            dataset: dictionary with dataset of scores that the users did for each lot
        ## Returns:
            SVD: save a SVD model to predict recommended coffees 
    '''
    knn = NearestNeighbors(metric='cosine', algorithm='brute', n_neighbors=3, n_jobs=-1)
    knn.fit(csr_dataset)
    pickle.dump(knn, open(model_path, 'wb'))

    return True
    
def get_prediction_for_recommended_engine(id_user, model, csr_dataset, num_recommended_items=10, verb=False):
    '''
        # Get Prediction model
        Get a recommendation of coffees for user id_user
        ## Args: 
            model: model to predict the coffees for user
            input_data: dictionary with id_user and array of coffees
        Note: To do predictions first is necesary get the model and save it in binary file, 
        executing: get_trained_model_recommended_engine function
    '''
    
    array_id_recommended_coffees = np.empty(shape=num_recommended_items)
    array_id_recommended_coffees[:] = -1
    index_recommended_coffees = 0
    
    n_users=csr_dataset.shape[0]
    verbosity2(n_users, verb)
    percent_neighbors=0.8
    n_neighbors = 100
    if(n_neighbors>n_users):
        n_neighbors = int(n_users*percent_neighbors)
    
    _, id_similar_users = model.kneighbors(csr_dataset[id_user, :],n_neighbors=n_neighbors)
    id_similar_users = id_similar_users.flatten()
    id_similar_users= id_similar_users[1:]
    
    for i in id_similar_users:
        array_user_items = csr_dataset[i].multiply(csr_dataset[i] >= 4)
        for j in array_user_items.indices:
            if csr_dataset[id_user, j]==0:
                if (len(np.where(array_id_recommended_coffees==j)[0])==0):
                    if(index_recommended_coffees == num_recommended_items):
                        break
                    
                    array_id_recommended_coffees[index_recommended_coffees] = j + 1
                    index_recommended_coffees = index_recommended_coffees + 1
        if(index_recommended_coffees == num_recommended_items):
            break

    return [int(e) for e in array_id_recommended_coffees]

def train_recommendation_engine():
    # - Get dataset of scores
    dataset = consult_data_by_fields(dic_credentials,
                                    'score_lots',
                                    ('id_user', 'id_lot', 'score'))
    # - Convert dataset to CSR matrix
    csr_dataset = data_to_csr_matrix(dataset)
    # - Train model
    correct_generation = train_model_recommended_engine(csr_dataset,
                                                        path_recommendations_engine_model)
    if correct_generation:
        output_data = {
            'success': 'model trained'
        }
    else:
        output_data = {
            'error': 'error in model training'
        }
        
    return output_data

def get_recommended_lots_from_engine(input_data):
    id_user = input_data['id_user']
    # - Verify validity of the model file
    validity = True # ... pending function
    if validity:
        model_recommended_engine = get_model_recommended_engine(path_recommendations_engine_model)
        # - Get dataset of scores
        dataset = consult_data_by_fields(dic_credentials, 'score_lots',('id_user', 'id_lot', 'score'))
        csr_dataset = data_to_csr_matrix(dataset)
        # - Get ids of recommended lots
        ids_recommended_lots = get_prediction_for_recommended_engine(id_user, model_recommended_engine, csr_dataset)

        output_data = {
            'ids_recommended_lots': list(ids_recommended_lots)
        }
    else:
        # - Train model
        output_train_model = train_recommendation_engine()
        if 'success' in output_train_model.keys():
            output_data = get_recommended_lots_from_engine(input_data)
    
    return output_data

# ---------- USER TRENDS ----------
def get_users_ranking(input_data, dic_credentials, num_persons=10):
    # - Default output data
    output_data = {"ranking":[]}
    # - 
    id_role = input_data["id_role"]
    if not id_role in (1,2):
        return output_data
    else:
        # - Establish connection with database
        connection = psycopg2.connect(**dic_credentials)
        # - Get purchases table and sort by role and lot
        df_purchases = consult_data_by_fields(dic_credentials,
                                            'purchase_table','id_seller,id_buyer,id_lot,purchase_quantity'.split(','),
                                            f'id_purchase_status IN (3,7,9,10)')
        sort_field, field_to_del = ('id_seller','id_buyer') if id_role == 1 else ('id_buyer','id_seller')
        del df_purchases[field_to_del]
        df_purchases.sort_values(by=[sort_field,'id_lot'], inplace=True)
        # - Group by role
        grouped = df_purchases.groupby(sort_field)
        ids_persons = grouped.groups.keys()
        # - Ranking
        df_ranking = pd.DataFrame({sort_field:ids_persons,
                                'purchase_quantity':[sum(grouped.get_group(k)['purchase_quantity']) for k in ids_persons]})
        df_ranking.sort_values('purchase_quantity', ascending=False, inplace=True)
        # - Limit ranking to first n_results
        df_ranking = df_ranking[:num_persons]

        # - Traverse groups extracting stats
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
            if id_role == 1:
                # - Score
                farmer_score = round(np.mean(consult_data(connection,f'SELECT score FROM score_users WHERE id_user={id_person}').flatten()))
                # - Farm name
                id_farm_mp = consult_data(connection,f'SELECT id_farm FROM lot_table WHERE id_lot={df_pq.index[0]}').flatten()[0]
                farm_name = consult_data(connection,f'SELECT farm_name FROM farms_table WHERE id_farm={id_farm_mp}').flatten()[0]

                elms = [farmer_score, farm_name]
            else:
                elms = []
            # - Save info
            dic_persons[id_person] = [total_quantity, df_pq] + [person_name, user_profile_photo] + elms

        # - Supplies for buyer role
        if id_role == 2:
            dic_cup_profiles = {k:v for k,v in consult_data_by_fields(connection, 'coffee_profile_table', ('id_profile','profile_name')).values}
            dic_cup_profiles.update({'-1':'Otros'})
            dic_varieties = {k:v for k,v in consult_data_by_fields(connection, 'coffee_variations_table', ('id_variety','variety_name')).values}
            dic_varieties.update({'-1':'Otros'})
            dic_roasting_type = {k:v for k,v in consult_data_by_fields(connection, 'roasting_type_table', ('id_roast','roasting_name')).values}
            dic_roasting_type.update({'-1':'Otros'})

        # - Traverse persons info and get output data
        for id_person in dic_persons.keys():
            elms = dic_persons[id_person]
            total_quantity, df, user_name, user_profile_photo = elms[:4]
            # - Farmer
            if id_role == 1:
                # - Get best-seller cup profile info
                purch_quant, id_profile = df.iloc[0][['purchase_quantity', 'id_profile']].values
                profile_name = consult_data(connection, f'SELECT profile_name FROM coffee_profile_table where id_profile={id_profile}').flatten()[0]
                profile_purchase_percent = round(100*purch_quant/total_quantity,1)
                # - Output data
                output_data['ranking'].append({
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
            # - Businessman
            else:
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
                output_data['ranking'].append({
                    'id_user': int(id_person),
                    'user_name': user_name,
                    'user_profile_photo': elms[3],
                    'stats': dic_stats
                })
        connection.close()
    return output_data

def generate_feature_chart(percents, colors, circle_color='#E7E7E7'):
        fig, ax = plt.subplots(figsize=[5]*2)
        circle = Circle((0, 0), radius=1, facecolor=circle_color)
        ax.add_patch(circle)
        _ = ax.pie(percents,radius=0.9,colors=colors,wedgeprops=dict(width=0.2,ec=circle_color,lw=10))
        ax.axis('equal')

        return fig

def get_pie_charts_buyer_stats(dic_info, output_dir='./generated_charts'):
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
        dic_paths[f'chart_{feature}_path'] = fname
    return dic_paths

def get_user_trends(input_data):
    # - Validate id_role
    id_role = input_data['id_role']
    if id_role in (1,2):
        validity_database_connection = check_database_connection(dic_credentials)
        if validity_database_connection[0]:
            try:
                output_data = get_users_ranking(input_data, dic_credentials)
                if id_role == 2:
                    # - Get pie charts for each buyer and add chart iamge path
                    for dic_info in output_data['ranking']:
                        id_person = dic_info['id_user']
                        dic_paths = get_pie_charts_buyer_stats(dic_info)
                        for dic_person in output_data['ranking']:
                            if id_person == dic_person['id_user']:
                                dic_person['chart_paths'] = {}
                                for k in dic_paths.keys():  
                                    dic_person['chart_paths'][k] = dic_paths[k]
            except Exception as e:
                output_data = {'error': f'{type(e).__name__}, {str(e)}'}
        else:
            output_data = {'error': validity_database_connection[1]}
    else:
        output_data = {'error': 'invalid id_role'}

    return output_data

# ---------- RECOMMENDATIONS BASED ON SIMILARITY TO BUYER PREFERENCES ----------
def obtain_lot_similarity_with_buyer_preferences(input_data, dic_credentials):
    # - Extrat input data
    _, id_seller, id_buyer = input_data.values()
    # - Establish connection with database
    connection = psycopg2.connect(**dic_credentials)

    # - Get seller's lots
    # -- Farms
    ids_farms = consult_data(connection, f'SELECT id_farm FROM farms_table WHERE id_user={id_seller}').flatten()
    # -- Lots
    fields = 'id_lot','id_variety', 'id_profile', 'id_roast'
    df_lots = consult_data_by_fields(connection, 'lot_table', fields,
                                    f'id_farm IN ({str(list(ids_farms))[1:-1]})')
    df_lots.set_index('id_lot', inplace=True)
    df_lots.index = [int(e) for e in df_lots.index]

    # - Get buyer preferences
    df_purchases = consult_data_by_fields(connection, 'purchase_table', ['id_lot', 'purchase_quantity'],f'id_buyer={id_buyer}')
    df_purchases = df_purchases.groupby('id_lot').sum()
    df_purchases.index = [int(e) for e in df_purchases.index]
    df_purchases.sort_values(by='purchase_quantity', ascending=False, inplace=True)
    ids_purchs = str(list(df_purchases.index))[1:-1]
    # -- Add lot details
    ddf = consult_data_by_fields(connection, 'lot_table', ('id_lot', 'id_variety', 'id_profile', 'id_roast'),
                                f'id_lot IN ({ids_purchs})')
    ddf.set_index('id_lot', inplace=True)
    ddf.index = [int(e) for e in ddf.index]
    df_purchases = pd.concat((df_purchases,ddf),axis=1)
    # -- Sort by purchase quantity
    df_purchases.sort_values(by='purchase_quantity', ascending=False, inplace=True)

    # - Sort lot features by preference
    # -- Auxiliar function
    def estimate_recommendations(feature):
        id_refs = list({k:None for k in df_purchases[feature]}.keys())
        scores = []
        for idd in df_lots[feature]:
            if idd in id_refs:
                scores.append(id_refs.index(idd))
            else:
                scores.append(0)
        return scores
    # -- Apply to df_lots
    for feature in 'id_variety', 'id_profile', 'id_roast':
        df_lots[f'{feature}_weight'] = estimate_recommendations(feature)
    df_lots.sort_values(by=['id_profile_weight','id_variety_weight','id_roast_weight'])
    df_lots = df_lots[['id_variety', 'id_profile', 'id_roast']]

    # - Add remaining information from design
    ids_lots = f'({str(list(df_lots.index))[1:-1]})'
    # -- Name of cup profiles
    query = 'SELECT profile_name FROM coffee_profile_table WHERE id_profile=idd'
    cup_profile_names = [consult_data(connection, query.replace('idd',str(id_profile))).flatten()[0]
                                    for id_profile in df_lots['id_profile']]
    df_cp_names = pd.DataFrame({'cup_profile_name':cup_profile_names}, index=df_lots.index)
    # -- Lot numbers
    df_lot_numbers = consult_data_by_fields(connection, 'lot_table', ['id_lot','lot_number'],
                                        f'id_lot IN {ids_lots}').set_index('id_lot')
    df_lot_numbers.index = [int(e) for e in df_lot_numbers.index]
    # -- Lot photos
    df_lot_photos = consult_data_by_fields(connection, 'lot_photo', ['id_lot','lot_photo'],
                                        f'id_lot IN {ids_lots}').set_index('id_lot')
    df_lot_photos.index = [int(e) for e in df_lot_photos.index]
    # -- Lot prices
    df_lot_prices = consult_data_by_fields(connection, 'lot_quantity', ['id_lot', 'price_per_kilo'],
                                            f'id_lot IN {ids_lots}').set_index('id_lot')
    df_lot_prices.index = [int(e) for e in df_lot_prices.index]
    # -- Lot scores
    df_lot_scores = consult_data_by_fields(connection, 'score_lots', ['id_lot', 'score'],
                                            f'id_lot IN {ids_lots}')
    if df_lot_scores.empty:
        df_lot_scores = pd.DataFrame({'score':[None]*len(df_lots.index)}, index=df_lots.index)
    else:
        # --- Get score means
        df_lot_scores = df_lot_scores.groupby('id_lot').mean()
        df_lot_scores['score'] = [round(e) for e in df_lot_scores['score']]
    df_lot_scores.index = [int(e) for e in df_lot_scores.index]

    # -- Concatenate
    df_lots = pd.concat([df_lots,df_cp_names,df_lot_numbers,df_lot_photos,df_lot_prices,df_lot_scores], axis=1)
    # - Keep only columns of interest
    df_lots['id_lot'] = df_lots.index
    df_lots = df_lots[['id_lot', 'lot_number', 'lot_photo', 'price_per_kilo', 'score', 'cup_profile_name']]
    df_lots.columns = ['id_lot', 'lot_number', 'lot_photo', 'lot_price', 'lot_score', 'cup_profile_name']

    output_data = {
        'sorted_lots': df_lots.to_dict('records')
    }
    
    return output_data

def get_sorted_lots_based_on_buyer_preferences(input_data):
    # - Check database connection
    validity_database_connection = check_database_connection(dic_credentials)
    if validity_database_connection[0]:
        # - Check validity of ids
        _, id_seller, id_buyer = input_data.values()
        ans = [consult_data(dic_credentials,
                            f'SELECT EXISTS(SELECT 1 FROM users_table WHERE id_user={idd})').flatten()[0]
                            for idd in (id_seller, id_buyer)]
        if not False in ans:
            output_data = obtain_lot_similarity_with_buyer_preferences(input_data, dic_credentials)
        else:
            output_data = {'error': 'provided ids not found in database'}

    else:
        output_data = {'error': validity_database_connection[1]}

    return output_data

# ---------- LOT CODING ----------
def get_lot_coding(input_data):
    # - Get info from input data
    id_lot = input_data['id_lot']
    # - Get information
    fields = 'id_farm,id_variety,id_profile,id_roast'
    cons1 = consult_data(dic_credentials, f'SELECT {fields} FROM lot_table WHERE id_lot={id_lot}').flatten()
    if len(cons1) == 0:
        output_data = {'error': 'provided id_lot not found in database'}
    else:
        # - Features
        id_farm, id_variety, id_profile, id_roast = cons1
        # - Num of lot in farms
        farm_lots = consult_data(dic_credentials,f'SELECT id_lot FROM lot_table WHERE id_farm={id_farm}').flatten().tolist()
        num_lot = farm_lots.index(id_lot) + 1
        # - Provider and origin city
        id_user, id_village = consult_data(dic_credentials, f'SELECT id_user,id_village FROM farms_table WHERE id_farm={id_farm}').flatten()
        id_city = consult_data(dic_credentials,f'SELECT id_city FROM villages_table WHERE id_village={id_village}').flatten()[0]
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

        output_data = {
            'lot_coding': lot_coding
        }

    return output_data

# ---------- GET FARMER'S FARM INFO ------------
def service_get_farmers_farm_info(input_data: Dict[str, Any]):
    '''v1.0.0'''

    id_user = input_data['id_user']

    # - Consult farm owned by user
    fields = ('id_farm', 'farm_name', 'farm_number_lots', 'farm_longitude', 'farm_latitude', 'id_village', 'name_provided_by_user')
    farm_table = consult_data_by_fields(dic_credentials, 'farms_table',
                                        fields, f'id_user={id_user}')
    output_data, cont = {},1
    for farm_info in farm_table.values:
        # - Values
        id_farm, farm_name, farm_number_lots, farm_longitude, farm_latitude, id_village, name_provided_by_user = farm_info

        # - Altitude, climate and temperature
        dic_input = {
            'service': '',
            'longitud': float(farm_longitude),
            'latitude': float(farm_latitude)
        }
        altitude, temperature, climate = get_information_from_coordinate(dic_input).values()

        # - Location
        id_city, village_name = consult_data(dic_credentials,
                                            f'select id_city, village_name from villages_table where id_village={id_village}')[0]
        village_name = name_provided_by_user if name_provided_by_user is None else village_name
        id_state, city_name = consult_data(dic_credentials,
                                            f'select id_state, city_name from cities_table where id_city={id_city}')[0]
        state_name = consult_data(dic_credentials,
                                f'select state_name from states_table where id_state={id_state}')[0][0]

        output_data[cont] = {
            'id_farm': id_farm,
            'farm_name': farm_name,
            'state_name': state_name,
            'city_name': city_name,
            'village_name': village_name,
            'altitude': altitude,
            'cilmate': climate,
            'temperature': temperature,
            'number_of_lots': int(farm_number_lots),
        }
        cont += 1

    return output_data
