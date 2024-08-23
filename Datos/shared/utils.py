import logging
from colorama import Fore, Style

def verbosity(msg: str, verb: bool = True, tl: int = 1,
               pref: str = '-', prompt: str = '> ',
               level: str = 'info'):
    '''
    Show logs and save them in log file
    v2.1.0
    '''

    if verb:
        pref *= tl
        if level == 'info':
            logging.info(f'{pref}{prompt}{msg}{Style.RESET_ALL}')
        elif level == 'error':
            logging.error(f'{Fore.RED}\033[1m{pref}{prompt}{msg}{Style.RESET_ALL}')
        elif level == 'success':
            logging.info(f'{Fore.GREEN}\033[1m{pref}{prompt}{msg}{Style.RESET_ALL}')
        elif level == 'cyan':
            logging.info(f'{Fore.CYAN}\033[1m{pref}{prompt}{msg}{Style.RESET_ALL}')

def validate_parameters(parameter, expected_params):
    if parameter in expected_params:
        return True,
    else:
        return False, parameter
