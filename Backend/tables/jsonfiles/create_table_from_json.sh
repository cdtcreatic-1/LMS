#!/bin/bash

# Chequeamos si se proporcionó un archivo JSON como argumento
if [ $# -eq 0 ]; then
    echo "Error: debe proporcionar el nombre del archivo JSON como argumento."
    exit 1
fi

# Chequeamos si el archivo JSON existe
if [ ! -f "$1" ]; then
    echo "Error: el archivo '$1' no existe."
    exit 1
fi

# Creamos el nombre de la tabla basado en el nombre del archivo JSON
TABLE_NAME=$(basename "$1" .json)

# Leemos el contenido del archivo JSON y lo transformamos al formato necesario para el comando psql
JSON_CONTENT=$(cat "$1")
PG_COMMAND=$(echo "$JSON_CONTENT" | jq -r '.[] | " " + .variable_name + " " + .type_data + " " + .Restrictions + " " + .references' | tr '\n' ',' | sed 's/,$//')

# Reemplazamos las restricciones abreviadas por las completas
PG_COMMAND=$(echo "$PG_COMMAND" | sed 's/PK/PRIMARY KEY/g' | sed 's/NN U/NOT NULL UNIQUE/g' | sed 's/NN/NOT NULL/g' | sed 's/FK/FOREIGN KEY/g')

# Creamos el comando completo de psql para crear la tabla
PSQL_COMMAND="psql -U myuser -d database -c \"CREATE TABLE $TABLE_NAME ($PG_COMMAND);\""

# Guardamos el comando generado en un archivo
echo "$PSQL_COMMAND" >> command_tables.sh

echo "Comando generado:"
echo "$PSQL_COMMAND"
