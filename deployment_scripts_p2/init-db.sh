#!/bin/bash

for file in $(ls /docker-entrypoint-initdb.d/*.sql); do
  psql -U myuser -d database -f $file
done