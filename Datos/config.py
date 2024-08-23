from os import getenv
import logging

class Config():

    # - Logs configurations
    log_file_path = getenv('LOG_FILE_PATH')
    open(log_file_path, 'w')

    dic_params = {
        'level': logging.INFO,
        'format': "%(asctime)s [%(levelname)s]:\t %(message)s",
        'datefmt': '%Y-%m-%d %H:%M:%S',
        'handlers': [logging.StreamHandler(),
                    logging.FileHandler(log_file_path)]
        }

    logging.basicConfig(**dic_params)
