from os import path
from flask import Flask, request, jsonify, send_from_directory
from config import Config
from controller import call_data_service
from shared.utils import verbosity

from functions import *

# - Initialize app
app = Flask(__name__)
app.config.from_object(Config)

@app.route('/consume_farmer_profile_data_microservice', methods=['POST'])
def consume_farmer_profile_data_microservice():
    input_data = request.get_json()
    verbosity('\n', pref='', prompt='')
    verbosity(f'{"="*50}', pref='', prompt='')
    verbosity(f"received data: {input_data}\n")

    # - Send data to controller
    input_data['service'] = 'farmer_profile_data_service'
    output_data = call_data_service(input_data)

    verbosity(f'{"="*50}\n', pref='', prompt='')
    return jsonify(output_data)

@app.route('/consume_businessman_profile_data_microservice', methods=['POST'])
def consume_businessman_profile_data_microservice():
    input_data = request.get_json()
    verbosity('\n', pref='', prompt='')
    verbosity(f'{"="*50}', pref='', prompt='')
    verbosity(f"received data: {input_data}\n")

    # - Send data to controller
    input_data['service'] = 'businessman_profile_data_service'
    output_data = call_data_service(input_data)

    verbosity(f'{"="*50}\n', pref='', prompt='')
    return jsonify(output_data)

@app.route('/consume_learner_profile_data_microservice', methods=['POST'])
def consume_learner_profile_data_microservice():
    input_data = request.get_json()
    verbosity('\n', pref='', prompt='')
    verbosity(f'{"="*50}', pref='', prompt='')
    verbosity(f"received data: {input_data}\n")

    # - Send data to controller
    input_data['service'] = 'learner_profile_data_service'
    output_data = call_data_service(input_data)

    verbosity(f'{"="*50}\n', pref='', prompt='')
    return jsonify(output_data)


# ------------ OLD SERVICES -----------
@app.route('/charts/<filename>', methods=['GET'])
def serve_charts(filename):
    # Verificar que el archivo solicitado tiene una extensión válida
    if not path.splitext(filename)[-1].lower() in ['.png', '.svg', '.pdf']:
        return "Archivo no permitido", 400
    
    return send_from_directory('generated_charts', filename, as_attachment=False)

@app.route('/get_data_geoinformation_service', methods=['POST'])
def get_data_geoinformation_service():
    try:
        input_data = request.get_json()
        input_data = request.get_json()
        verbosity('\n', pref='', prompt='')
        verbosity(f'{"="*50}', pref='', prompt='')
        verbosity(f"received data: {input_data}\n")

        # - Get service reference
        service = input_data['service']
        verbosity(f'> {service.upper()}', pref='', prompt='')
        # - Execute service
        if service == 'get_information_from_coordinate':
            output_data = get_information_from_coordinate(input_data)

        elif service == 'get_geoinformation_from_polygon':
            output_data = get_geoinformation_from_polygon(input_data)

        elif service == 'get_entities_ids_from_coordinate':
            output_data = get_entities_ids_from_coordinate(input_data)

        elif service == 'get_coffee_recommended_prices':
            output_data = get_coffee_recommended_prices(input_data)
            
        elif service == 'get_user_trends':
            id_role = input_data['id_role']
            if id_role == 1:
                input_data['service'] = 'businessman_profile_data_service'
                input_data['microservice'] = 'get_farmer_trends'
                output_data = call_data_service(input_data)
            else:
                # input_data['service'] = 'farmer_profile_data_service'
                # input_data['microservice'] = 'get_businessmen_trends'
                output_data = get_user_trends(input_data)

        elif service == 'get_sorted_lots_based_on_buyer_preferences':
            output_data = get_sorted_lots_based_on_buyer_preferences(input_data)

        elif service == 'get_lot_coding':
            output_data = get_lot_coding(input_data)
        
        elif service == 'train_recommendation_engine':
            output_data = train_recommendation_engine()

        elif service == 'get_recommended_lots_from_engine':
            output_data = get_recommended_lots_from_engine(input_data)

        elif service == 'service_get_farmers_farm_info':
            output_data = service_get_farmers_farm_info(input_data)
            
        else:
            output_data = {
                'error': 'invalid service'
            }
    except Exception as e:
        output_data = {'error': f'{type(e).__name__}, {str(e)}'}
    
    verbosity(f'{"="*50}\n', pref='', prompt='')
    return jsonify(output_data)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5020)
