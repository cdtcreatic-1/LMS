import pandas as pd
import numpy as np
import psycopg2

def consult_data(elm_connection, query, varss=None, columns=None):
    connection = psycopg2.connect(**elm_connection) if isinstance(elm_connection, dict) else elm_connection
    cursor = connection.cursor()
    cursor.execute(query,varss)
    data = np.asarray(cursor.fetchall())
    if columns is not None:
        data = pd.DataFrame(dict(zip(columns,data.T)))
    cursor.close()
    if isinstance(elm_connection, dict):
        connection.close()

    return data

def consult_data_by_fields(connection, table_name, fields, where=''):
    sent_where = '' if where == '' else f' WHERE {where}'
    return consult_data(connection, f'SELECT {",".join(fields)} FROM {table_name}{sent_where};', columns=fields)

def check_database_connection(dic_credentials):
    try:
        connection = psycopg2.connect(**dic_credentials)
        connection.close()
        return True,
    except Exception as e:
        return False,f'{type(e).__name__}, {str(e)}'