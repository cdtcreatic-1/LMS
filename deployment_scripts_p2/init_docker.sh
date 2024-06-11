#!/bin/bash
mkdir -p ../Backend/src/exchange_api/uploads
cp ./important_dates.pdf ../Backend/src/exchange_api/uploads
cp ./tables/03-test_tables/test_uploads/* ../Backend/src/exchange_api/uploads #For testing propurses
cp ./*.png ../Backend/src/exchange_api/uploads
cp ./*.jpg ../Backend/src/exchange_api/uploads

chmod 777 ../Backend/src/exchange_api/uploads
if [ "$1" == "test" ]; then
  compose_file="docker-compose.test.yml"
elif [ "$1" == "db" ]; then
  compose_file="docker-compose.dbtest.yml"
else
    compose_file="docker-compose.prod.yml"
fi

docker compose -f $compose_file up --build -d
