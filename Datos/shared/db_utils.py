from typing_extensions import Sequence, Dict
import pandas as pd
import numpy as np
import psycopg2
from psycopg2.extensions import connection
from psycopg2.extensions import register_adapter, AsIs
register_adapter(np.int64, AsIs)

def consult_data(connection_element: Dict|connection, query, varss=None, columns=None):
    '''
    ...
    v1.0.0
    '''

    connection = psycopg2.connect(**connection_element) if isinstance(connection_element, dict) else connection_element
    # - Instantiate cursor and execute query
    cursor = connection.cursor()
    cursor.execute(query,varss)
    # - Get data
    data = np.asarray(cursor.fetchall())
    if columns is not None:
        data = pd.DataFrame(dict(zip(columns,data.T)))
    cursor.close()
    # - Close connection if necessary
    if isinstance(connection_element, dict):
        connection.close()

    return data

def consult_data_by_fields(connection_element: Dict|connection, table_name: str,
                           fields: Sequence = None, where: str = ''):
    '''
    ...
    v2.1.0
    '''

    # - Establish database connection
    connection = psycopg2.connect(**connection_element) if isinstance(connection_element, dict) else connection_element
    # - Where sentence
    sent_where = '' if where == '' else f' WHERE {where}'
    # - Do consult
    if fields is None:
        fields = consult_data(connection,
                              f"select column_name from information_schema.columns where table_name = '{table_name}'").flatten()
    elif isinstance(fields, str):
        fields = [fields]
    data = consult_data(connection, f'SELECT {",".join(fields)} FROM {table_name}{sent_where};', columns=fields)

    # - Close connection if necessary
    if isinstance(connection_element, dict):
        connection.close()

    return data

def insert_data(connection_element: Dict|connection, table_name: str, df):
    '''
    ...
    v1.0.0
    '''

    # - Verify connection element
    connection = psycopg2.connect(**connection_element) if isinstance(connection_element, dict) else connection_element
    # - Instantiate cursor
    cursor = connection.cursor()
    fields_to_insert = ', '.join(df.columns)
    phs = ', '.join(['%s']*len(df.columns))
    insert_sentence = f'INSERT INTO {table_name} ({fields_to_insert}) VALUES ({phs});'
    for values in df.values:
        cursor.execute(insert_sentence, values)
    cursor.close()
    connection.commit()
    # - Close connection if necessary
    if isinstance(connection_element, dict):
        connection.close()
    
    return True

def update_data(connection_element: Dict|connection, table_name: str,
                columns_to_update: Sequence, df):
    '''
    ...
    v1.0.0
    '''
    #TODO When theres no specified columns_to_update...

    # - Verify connection element
    connection = psycopg2.connect(**connection_element) if isinstance(connection_element, dict) else connection_element
    # - Instantiate cursor
    cursor = connection.cursor()

    # - Validate columns
    if isinstance(columns_to_update, str):
        columns_to_update = [columns_to_update]

    # - Fields to update
    vals_to_update = ', '.join([f'{col} = %s' for col in columns_to_update])

    # - Fields not to be updated used as reference
    columns_ref = list(df.columns)
    for col in columns_to_update:
        columns_ref.pop(columns_ref.index(col))
    where_sent = ' AND '.join([f'{col} = %s' for col in columns_ref])

    # - Construct sentence
    update_sentence = f'UPDATE {table_name} SET {vals_to_update} WHERE {where_sent}'
    
    # - Update data
    for values in df[list(columns_to_update) + columns_ref].values:
        cursor.execute(update_sentence, values)
    cursor.close()
    connection.commit()

    # - Close connection if necessary
    if isinstance(connection_element, dict):
        connection.close()

    return True

def check_existence_of_field_and_value(connection_element: Dict|connection,
                                       table_name: str, field: str, field_value: str|int):
    '''
    v1.0.0
    '''

    # - Construct query
    query = f'SELECT EXISTS( SELECT 1 FROM {table_name} WHERE {field}={field_value})'
    # - Do query
    ans = consult_data(connection_element, query).flatten()[0]

    return ans

def check_existence_of_elements(connection_element: Dict|connection, list_elems):
    '''
    ...
    v1.0.0
    '''
    
    no_existence = []
    for table_name, field, value in list_elems:
        if not check_existence_of_field_and_value(connection_element,
                                                table_name, field, value):
            no_existence.append(f'{field}={value}->{table_name}')

    return no_existence

def check_existence_of_combined_elements(connection_element: Dict|connection, table_name: str,
                                         elements):
    '''
    ...
    v1.0.0
    '''

    sent_where = ' AND '.join([f'{field} = {value}' for field,value in elements])
    query = f'SELECT EXISTS( SELECT 1 FROM {table_name} WHERE {sent_where})'
    
    return consult_data(connection_element, query).flatten()[0]


def check_database_connection(dic_credentials: Dict, return_connection: bool = False):
    '''
    ...
    v2.0.0
    '''

    try:
        connection = psycopg2.connect(**dic_credentials)
        if return_connection:
            return True, connection
        else:
            connection.close()
            return True,

    except Exception as e:
        return False,f'{type(e).__name__}, {str(e)}'

def consult_table_data_as_dict(connection_element, pk, table_name):
    '''
    ...
    v1.0.0
    '''
    # - Do consult
    df = consult_data_by_fields(connection_element, table_name)
    # - Set pk as index
    df.set_index(pk, inplace=True)
    # - Build dict
    dic = {k:v for k,v in zip(df.index,df.to_dict(orient='records'))}
    return dic

def get_number_of_rows_in_table(connection_element, table_name):
    return consult_data(connection_element, f'SELECT COUNT(*) FROM {table_name}').flatten()[0]
