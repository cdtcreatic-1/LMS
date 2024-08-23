from typing_extensions import Dict, Any
from shared.utils import verbosity

from .microservices.make_a_chatbot_query.controller import ms_make_a_chatbot_query
from .microservices.make_a_chatbot_query2.controller import ms_make_a_chatbot_query2
from .microservices.estimate_learning_style.controller import ms_estimate_learning_style
from .microservices.obtain_success_rate_of_evaluation_results.controller import ms_obtain_success_rate_of_evaluation_results
from .microservices.estimate_course_progress.controller import ms_estimate_course_progress
from .microservices.get_user_answers.controller import ms_get_user_answers
from .microservices.plot_module_results.controller import ms_plot_module_results
from .microservices.delete_file_generated_from_microservice.controller import ms_delete_file_generated_from_microservice
from .microservices.generate_course_certificate.controller import ms_generate_course_certificate
from .microservices.get_course_recommendations.controller import ms_get_course_recommendations

def call_learner_profile_data_service(input_data: Dict[str, Any]):
    '''
    '''

    microservice = input_data['microservice']
    verbosity(f'>> {microservice.upper()}', pref='', prompt='')

    if microservice == 'make_a_chatbot_query':
        output_data = ms_make_a_chatbot_query(input_data)
    elif microservice == 'make_a_chatbot_query2':
        output_data = ms_make_a_chatbot_query2(input_data)
    elif microservice == 'estimate_learning_style':
        output_data = ms_estimate_learning_style(input_data)
    elif microservice == 'obtain_success_rate_of_evaluation_results':
        output_data = ms_obtain_success_rate_of_evaluation_results(input_data)
    elif microservice == 'estimate_course_progress':
        output_data = ms_estimate_course_progress(input_data)
    elif microservice == 'get_user_answers':
        output_data = ms_get_user_answers(input_data)
    elif microservice == 'plot_module_results':
        output_data = ms_plot_module_results(input_data)    
    elif microservice == 'delete_file_generated_from_microservice':
        output_data = ms_delete_file_generated_from_microservice(input_data)
    elif microservice == 'generate_course_certificate':
        output_data = ms_generate_course_certificate(input_data)
    elif microservice == 'get_course_recommendations':
        output_data = ms_get_course_recommendations(input_data)
    else:
        output_data = {
            'error': 'invalid microservice'
        }
        verbosity('invalid microservice', level='error')

    return output_data
