for jsonfile in *.json; do ./create_table_from_json.sh $jsonfile ; done

ssconvert --export-type=Gnumeric_stf:stf_csv -S ../Documentation/tables.ods tablas