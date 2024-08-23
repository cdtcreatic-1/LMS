import os

# Directorio donde se encuentran los archivos CSV
data_dir = "./"

# Nombre del archivo donde se guardará la salida
output_file = "output.txt"

# Bucle a través de los archivos CSV en el directorio de datos
for csv_file in os.listdir(data_dir):
    if csv_file.endswith(".csv"):
        # Obtener el nombre de la tabla del nombre del archivo CSV
        table_name = os.path.splitext(csv_file)[0]

        # Obtener la primera fila del archivo CSV para obtener los nombres de las columnas
        with open(os.path.join(data_dir, csv_file), "r") as f:
            column_names = f.readline().strip().replace(",", "`,`")
            column_names = f"`{column_names}`"

        # Generar el comando INSERT SQL para la tabla
        insert_command = f"INSERT INTO {table_name} ({column_names}) VALUES "

        # Bucle a través de las filas de datos en el archivo CSV
        with open(os.path.join(data_dir, csv_file), "r") as f:
            next(f)  # saltar la primera fila que ya hemos leido
            for data_row in f:
                # Escapar comillas simples en los valores de las filas de datos
                data_row = data_row.replace("'", "''")

                # Agregar comillas simples a cada valor de la fila de datos
                data_row = data_row.strip().replace(",", "','")
                data_row = f"'{data_row}'"

                # Agregar la fila de datos al comando INSERT SQL
                insert_command += f"({data_row}),"

        # Eliminar la coma extra del final del comando INSERT SQL
        insert_command = insert_command[:-1]

        # Escribir el comando INSERT SQL en el archivo de salida
        with open(output_file, "a") as f:
            f.write(insert_command + "\n")
            
        # Imprimir el comando INSERT SQL
        print(insert_command)
