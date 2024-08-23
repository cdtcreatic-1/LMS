from os import path

cwd = path.dirname(__file__)

path_csv_states_geoinfo = path.join(cwd, 'static', 'deptos_centroids.csv')
path_csv_cities_geoinfo = path.join(cwd, 'static', 'mpos_centroids.csv')
path_csv_villages_geoinfo = path.join(cwd, 'static', 'vdas_centroids.csv')
