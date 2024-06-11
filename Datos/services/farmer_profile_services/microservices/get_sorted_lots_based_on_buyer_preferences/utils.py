import psycopg2
import pandas as pd
from shared.db_utils import consult_data, consult_data_by_fields
from shared.utils import verbosity

def obtain_lot_similarity_with_buyer_preferences(id_seller, id_buyer, dic_credentials, min_purchases):

    # - Establish connection with database
    connection = psycopg2.connect(**dic_credentials)

    # - Get buyer preferences
    df_purchases = consult_data_by_fields(connection, 'purchase_table', ['id_lot', 'purchase_quantity'],f'id_buyer={id_buyer}')
    if len(df_purchases) <= min_purchases:
        # TODO
        verbosity('No hay suficientes compras realizadas, accediendo a preferencias...', tl=3)

        pdf = consult_data_by_fields(connection, 'businesman_coffee_interested',
                                     ('id_profile', 'id_roast', 'id_city'))
        if len(pdf) == 0:
            df_lots = pd.DataFrame()
            raise IndexError('No hay preferencias registradas para el comprador')
        else:
            pass

    else:
        verbosity(f'{len(df_purchases)} compras realizadas', tl=4)
        
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

        # - Get seller's lots
        # -- Farms
        ids_farms = consult_data(connection, f'SELECT id_farm FROM farms_table WHERE id_user={id_seller}').flatten()
        # -- Lots
        fields = 'id_lot','id_variety', 'id_profile', 'id_roast', 'lot_coding'
        df_lots = consult_data_by_fields(connection, 'lot_table', fields,
                                        f'id_farm IN ({str(list(ids_farms))[1:-1]})')
        df_lots.set_index('id_lot', inplace=True)
        df_lots.index = [int(e) for e in df_lots.index]

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
        df_lots = df_lots[['id_variety', 'id_profile', 'id_roast', 'lot_coding']]

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
        df_lots = df_lots[['id_lot', 'lot_number', 'lot_coding', 'lot_photo', 'price_per_kilo', 'score', 'cup_profile_name']]
        df_lots.columns = ['id_lot', 'lot_number', 'lot_coding', 'lot_photo', 'lot_price', 'lot_score', 'cup_profile_name']

    connection.close()

    return df_lots

def get_sorted_lots_based_on_buyer_preferences(id_seller, id_buyer, dic_credentials, min_purchases):

    # - Check validity of ids
    ans = [consult_data(dic_credentials,
                        f'SELECT EXISTS(SELECT 1 FROM users_table WHERE id_user={idd})').flatten()[0]
                        for idd in (id_seller, id_buyer)]
    if not False in ans:
        output_data = obtain_lot_similarity_with_buyer_preferences(id_seller, id_buyer,
                                                                   dic_credentials, min_purchases)
    else:
        output_data = {'error': 'provided ids not found in database'}

    return output_data
