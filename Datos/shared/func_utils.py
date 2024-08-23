from typing_extensions import Callable, Dict, Any
import multiprocessing


'''
Auxiliary functions for performing other functions.
'''

def execute_function_with_timeout(maximum_time: int, func: Callable[..., Any],
                                  dic_parameters: Dict[str, Any] = None,
                                  verb: bool = False):
    '''
    Executes a function under maximum execution time.

    v1.0.0
    '''
    
    if dic_parameters is None:
        dic_parameters = {}

    result_queue = multiprocessing.Queue()

    def wrapper():
        try:
            result = func(**dic_parameters)
            result_queue.put(result)
        except Exception as e:
            if verb:
                print(e)
            result_queue.put(None)

    # - Process to execute function
    process = multiprocessing.Process(target=wrapper)
    # - Start process
    process.start()
    # - Wait until completion or until the maximum time is exceeded
    process.join(timeout=maximum_time)
    # - It maximum time is exceeded, stop process
    if process.is_alive():
        process.terminate()
        process.join()
        raise TimeoutError('--> error: maximum execution time exceded')
    # - Get return value from queue
    return result_queue.get()
