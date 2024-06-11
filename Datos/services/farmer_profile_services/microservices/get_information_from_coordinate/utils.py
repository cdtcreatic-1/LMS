import rasterio

def get_raster_value_from_coordinate(raster_path: str, lon: float|int, lat: float|int):
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
    
def get_information_from_coordinate(longitude, latitude,
                                    altitude_raster_path, temperature_raster_path, climate_raster_path):
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

    # - Get output data
    altitude = get_raster_value_from_coordinate(altitude_raster_path, longitude, latitude)
    cod_temperature = get_raster_value_from_coordinate(temperature_raster_path, longitude, latitude)
    temperature = dic_temperature_codif[cod_temperature]
    cod_climate = get_raster_value_from_coordinate(climate_raster_path, longitude, latitude)
    climate = dic_climate_codif[cod_climate]

    return int(altitude), temperature, climate
