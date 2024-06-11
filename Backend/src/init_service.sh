#!/bin/bash
npm install
./setup_dev_env.sh

if [ "$1" == "test" ]; then
  cd exchange_api && npm run test
elif [ "$1" == "start" ]; then
  cd exchange_api && npm start
else
  echo "Argumento no reconocido: $1. Usa 'test' o 'start'."
  exit 1
fi
