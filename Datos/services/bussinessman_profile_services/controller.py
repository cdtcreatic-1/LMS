from typing_extensions import Dict, Any
from shared.utils import verbosity

from .microservices.get_products_by_filtered_search.controller import ms_get_products_by_filtered_search
from .microservices.get_lot_information.controller import ms_get_lot_information
from .microservices.get_available_items_for_lots.controller import ms_get_available_items_for_lots
from .microservices.get_farmer_trends.controller import ms_get_farmer_trends

def call_businessman_profile_data_service(input_data: Dict[str, Any]):
    '''
    '''

    microservice = input_data['microservice']
    verbosity(f'>> {microservice.upper()}', pref='', prompt='')

    if microservice == 'get_products_by_filtered_search':
        output_data = ms_get_products_by_filtered_search(input_data)

    elif microservice == 'get_lot_information':
        output_data = ms_get_lot_information(input_data)

    elif microservice == 'get_available_items_for_lots':
        output_data = ms_get_available_items_for_lots()
    elif microservice == 'get_farmer_trends':
        output_data = ms_get_farmer_trends(input_data)

        # elif microservice == 'train_recommendation_engine':
    #     pass
        
    # elif microservice == 'get_recommended_lots_from_engine':
    #     pass
        
    else:
        output_data = {
            'status': 'failed',
            'error_message': 'invalid microservice'
        }
        raise ValueError('invalid microservice')

    return output_data
