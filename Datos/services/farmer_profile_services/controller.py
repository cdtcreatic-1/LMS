from typing_extensions import Dict, Any
from shared.utils import verbosity

from .microservices.get_information_from_coordinate.controller import ms_get_information_from_coordinate
from .microservices.get_geoinformation_from_polygon.controller import ms_get_geoinformation_from_polygon
from .microservices.get_entities_ids_from_coordinate.controller import ms_get_entities_ids_from_coordinate
from .microservices.get_coffee_recommended_prices.controller import ms_get_coffee_recommended_prices
from .microservices.get_lot_coding.controller import ms_get_lot_coding
from .microservices.get_businessmen_trends.controller import ms_get_businessmen_trends
from .microservices.get_sorted_lots_based_on_buyer_preferences.controller import ms_get_sorted_lots_based_on_buyer_preferences
from .microservices.get_farm_info.controller import ms_get_farm_info
from .microservices.get_farms_from_user.controller import ms_get_farms_from_user
from .microservices.get_lot_information.controller import ms_get_lot_information

def call_farmer_profile_data_service(input_data: Dict[str, Any]):
    '''
    '''

    microservice = input_data['microservice']
    verbosity(f'>> {microservice.upper()}', pref='', prompt='')

    if microservice == 'get_information_from_coordinate':
        output_data = ms_get_information_from_coordinate(input_data)
    
    elif microservice == 'get_geoinformation_from_polygon':
        output_data = ms_get_geoinformation_from_polygon(input_data)

    elif microservice == 'get_entities_ids_from_coordinate':
        output_data = ms_get_entities_ids_from_coordinate(input_data)
        
    elif microservice == 'get_coffee_recommended_prices':
        output_data = ms_get_coffee_recommended_prices(input_data)

    elif microservice == 'get_lot_coding':
        output_data = ms_get_lot_coding(input_data)

    elif microservice == 'get_businessmen_trends':
        output_data = ms_get_businessmen_trends(input_data)
    
    elif microservice == 'get_sorted_lots_based_on_buyer_preferences':
        output_data = ms_get_sorted_lots_based_on_buyer_preferences(input_data)

    elif microservice == 'get_farm_info':
        output_data = ms_get_farm_info(input_data)

    elif microservice == 'get_farms_from_user':
        output_data = ms_get_farms_from_user(input_data)

    elif microservice == 'get_lot_information':
        output_data = ms_get_lot_information(input_data)
        
    else:
        output_data = {
            'status': 'failed',
            'error_message': 'invalid microservice'
        }
        raise ValueError('invalid microservice')

    return output_data

