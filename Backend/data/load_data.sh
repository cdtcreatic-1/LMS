#!/bin/bash

# Directorio donde se encuentran los archivos CSV
data_dir="./"

# Bucle a través de los archivos CSV en el directorio de datos
for csv_file in $data_dir/*.csv; do

    # Obtener el nombre de la tabla del nombre del archivo CSV
    table_name=$(basename $csv_file | cut -d '/' -f 2 | cut -d '.' -f 1)

    # Obtener la primera fila del archivo CSV para obtener los nombres de las columnas
    column_names=$(head -n 1 $csv_file | sed 's/,/`,`/g; s/^/`/; s/$/`/')

    # Generar el comando INSERT SQL para la tabla
    insert_command="INSERT INTO $table_name ($column_names) VALUES "

    # Bucle a través de las filas de datos en el archivo CSV
    while read data_row; do

        # Escapar comillas simples en los valores de las filas de datos
        data_row=$(echo $data_row | sed "s/'/''/g")

        # Agregar comillas simples a cada valor de la fila de datos
        data_row=$(echo $data_row | sed "s/,/','/g" | sed "s/^/'/" | sed "s/$/'/")

        # Agregar la fila de datos al comando INSERT SQL
        insert_command="$insert_command ($data_row),"

    done < <(tail -n +2 $csv_file)

    # Eliminar la coma extra del final del comando INSERT SQL
    insert_command=${insert_command%?};

    # Imprimir el comando INSERT SQL
    echo $insert_command

done
