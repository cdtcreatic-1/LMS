# Crear tabla "associations" con ID, nombre y situación únicos
psql -U myuser -d database -c "CREATE TABLE associations (id_association SMALLINT PRIMARY KEY , association_name VARCHAR(45) NOT NULL UNIQUE , association_situation BOOLEAN NOT NULL);"

# Crear tabla "business" con nombre de la empresa, registro comercial, ciudad, código postal, ID de usuario y situación
psql -U myuser -d database -c "CREATE TABLE business (company_name VARCHAR(45) NOT NULL , company_commercialRegistry VARCHAR(250) NOT NULL  UNIQUE , company_city SMALLINT FOREIGN KEY , company_zipCode VARCHAR(45) NOT NULL  , user_id SMALLINT FOREIGN KEY , company_situation BOOLEAN NOT NULL );"

# Crear tabla "cities" con ID y nombre de la ciudad
psql -U myuser -d database -c "CREATE TABLE cities (id_city SMALLINT PRIMARY KEY , city_name VARCHAR(45) NOT NULL UNIQUE);"

# Crear tabla "cities_states" con IDs de ciudad y estado
psql -U myuser -d database -c "CREATE TABLE cities_states (id_state SMALLINT FOREIGN KEY states(id_state), id_city SMALLINT FOREIGN KEY cities(id_city));"

# Crear tabla "climates" con ID y nombre del clima
psql -U myuser -d database -c "CREATE TABLE climates (id_climate SMALLINT PRIMARY KEY , climate_name VARCHAR(45) NOT NULL UNIQUE);"

# Crear tabla "coffe_profile" con ID y nombre del perfil de café
psql -U myuser -d database -c "CREATE TABLE coffe_profile (id_profile SMALLINT PRIMARY KEY , profile_name VARCHAR(45) NOT NULL UNIQUE);"

# Crear tabla "coffe_variations" con ID y nombre de la variedad de café
psql -U myuser -d database -c "CREATE TABLE coffe_variations (id_variety SMALLINT PRIMARY KEY , variety_name VARCHAR(45) NOT NULL UNIQUE);"

# Crear tabla "countries" con ID y nombre del país
psql -U myuser -d database -c "CREATE TABLE countries (id_county SMALLINT PRIMARY KEY , country_name VARCHAR(45) NOT NULL UNIQUE);"

# Crear tabla "farms" con ID, nombre, número de lotes, ID de aldea, coordenadas, registro comercial, fotos, altitud, temperatura, clima, ID de usuario y situación
psql -U myuser -d database -c "CREATE TABLE farms (id_farm SMALLINT PRIMARY KEY , farm_name VARCHAR(45) NOT NULL , farm_number_lots SMALLINT NOT NULL , id_village SMALLINT FOREIGN KEY villages(id_village), farm_longitude REAL NOT NULL , farm_latitude REAL NOT NULL , farm_commercial_registry VARCHAR(250) NOT NULL UNIQUE , farm_photos VARCHAR(250)  , farm_altitude SMALLINT NOT NULL ,  id_climate SMALLINT FOREIGN KEY climates(id_climate), id_user SMALLINT FOREIGN KEY users(id_user), farm_situation BOOLEAN NOT NULL);"

# Crear tabla "lots" con ID, ID de variedad, ID de perfil, ID de asociación, cantidad disponible, ID de tostado, descripción de producción, certificados y referencia de producto
psql -U myuser -d database -c "CREATE TABLE lots (id_lots SMALLINT PRIMARY KEY , id_variety SMALLINT FOREIGN KEY coffe_variations(id_variety), id_profile SMALLINT FOREIGN KEY coffe_profile(id_profile), id_association INTEGER FOREIGN KEY associations(id_association), product_avaliable_amount SMALLINT NOT NULL , id_roast SMALLINT FOREIGN KEY roasting_type(id_roast), product_production_description_text VARCHAR(2000)  , product_production_description_audio VARCHAR(250)  , product_sc_certificate VARCHAR(250) NOT NULL UNIQUE , product_taster_certificate VARCHAR(250) NOT NULL UNIQUE , id_farm SMALLINT FOREIGN KEY farms(id_farm), product_situation BOOLEAN NOT NULL , product_referenceNumber VARCHAR(45) NOT NULL);"

# Crear tabla "roasting_type" con ID y nombre del tipo de tostado
psql -U myuser -d database -c "CREATE TABLE roasting_type (id_roast SMALLINT PRIMARY KEY , roasting_name VARCHAR(45) NOT NULL UNIQUE);"

# Crear tabla "roles" con ID y nombre del rol
psql -U myuser -d database -c "CREATE TABLE roles (id_role SMALLINT PRIMARY KEY , role_name VARCHAR(45) NOT NULL UNIQUE);"

# Crear tabla "states_countries" con IDs de estado y país
psql -U myuser -d database -c "CREATE TABLE states_countries (id_country SMALLINT FOREIGN KEY , id_state SMALLINT FOREIGN KEY);"

# Crear tabla "states" con ID y nombre del estado
psql -U myuser -d database -c "CREATE TABLE states (id_state SMALLINT PRIMARY KEY , state_name VARCHAR(45) NOT NULL UNIQUE);"

# Crear tabla "users" con IDs de estado y país
psql -U myuser -d database -c "CREATE TABLE users (id_user SMALLINT PRIMARY KEY , user_name VARCHAR(45) NOT NULL UNIQUE , user_phone VARCHAR(45) NOT NULL UNIQUE , user_email VARCHAR(45) NOT NULL UNIQUE , user_username VARCHAR(45) NOT NULL UNIQUE , user_identification_number VARCHAR(45) NOT NULL UNIQUE , user_password VARCHAR(45) NOT NULL UNIQUE , id_role SMALLINT  roles(id_role), user_tax_identification VARCHAR(250) NOT NULL UNIQUE , user_profile_photo VARCHAR(250)  , user_situation BOOLEAN NOT NULL , user_registration_date TIMESTAMP NOT NULL , user_identification_document VARCHAR(250)  , user_personal_description_text TEXT  , user_personal_description_audio VARCHAR(250) );"

# Crear tabla "villages_cities" con IDs de aldea y ciudad
psql -U myuser -d database -c "CREATE TABLE villages_cities (id_city SMALLINT FOREIGN KEY cities(id_city), id_village SMALLINT FOREIGN KEY villages(id_village));"

# Crear tabla "villages" con ID y nombre de la aldea
psql -U myuser -d database -c "CREATE TABLE villages (id_village SMALLINT PRIMARY KEY , village_name VARCHAR(45) NOT NULL UNIQUE);"

