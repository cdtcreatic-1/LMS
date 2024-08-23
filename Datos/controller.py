from shared.utils import verbosity

from services.farmer_profile_services.controller import call_farmer_profile_data_service
from services.bussinessman_profile_services.controller import call_businessman_profile_data_service
from services.learner_profile_services.controller import call_learner_profile_data_service

def call_data_service(input_data):

    try:
        # - Get service reference
        service = input_data['service']
        verbosity(f'> {service.upper()}', pref='', prompt='')

        # - FARMER SERVICES
        if service == 'farmer_profile_data_service':
            output_data = call_farmer_profile_data_service(input_data)
        
        elif service == 'businessman_profile_data_service':
            output_data = call_businessman_profile_data_service(input_data)

        elif service == 'learner_profile_data_service':
            output_data = call_learner_profile_data_service(input_data)
                
        else:
            output_data = {
                'error': 'invalid service'
            }
            verbosity('invalid service', level='error')
            raise ValueError('invalid service')

    except Exception as e:
        verbosity(f'error: {e}', level='error')
        output_data = {
            'status': 'failed',
            'error': f'{type(e).__name__}, {str(e)}'
            }

    return output_data
