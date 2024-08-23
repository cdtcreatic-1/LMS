#!/bin/bash

## Execute docker-compose up --build -d
docker build -t cafe -f ./Dockerfile .
docker run -p 4200:80 -d cafe