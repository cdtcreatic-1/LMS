#!/bin/bash

if [ "$1" == "test" ]; then
  compose_file="docker-compose.test.yml"
  volume_name="p2dbdata_test"
elif [ "$1" == "db" ]; then
  compose_file="docker-compose.dbtest.yml"
  volume_name="p2dbdata_test_clone"
else
  compose_file="docker-compose.prod.yml"
  volume_name="p2dbdata"
fi

# Detiene los contenedores de Docker
docker compose -f $compose_file down

# Elimina el volumen de Docker
docker volume rm deployment_scripts_p2_$volume_name

# Elimina los archivos subidos
rm -rf ../Backend/src/exchange_api/uploads
