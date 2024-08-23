FROM postgres:16.2

COPY ./tables/01-p2_tables/*.sql /docker-entrypoint-initdb.d/
COPY ./tables/02-sql_tables_regions/*.sql /docker-entrypoint-initdb.d/
COPY ./tables/03-test_tables/*.sql /docker-entrypoint-initdb.d/
# COPY ./tables/04-learner_profile_sample_data/*.sql /docker-entrypoint-initdb.d/