--TABLAS UNITARIAS
-- Crear tabla "shipping_options" con ID y nombre de la opción de envío
CREATE TABLE shipping_options_table (
    id_shipping_option SERIAL PRIMARY KEY,
    shipping_option_name VARCHAR(45) NOT NULL UNIQUE,
    shipping_option_price INTEGER NOT NULL
);

-- Crear tabla "purchase_status_options" con ID y nombre del estado de la compra
CREATE TABLE purchase_status_options_table (
    id_purchase_status SERIAL PRIMARY KEY,
    status_name VARCHAR(45) NOT NULL UNIQUE
);

-- -- Crear tabla "payment_method_options" con ID y nombre del método de pago
-- CREATE TABLE id_payment_method (
--     id_payment_method SERIAL PRIMARY KEY,
--     method_name VARCHAR(45) NOT NULL UNIQUE
-- );

-- Crear tabla "type_document_table" con ID y nombre del tipo de documento 
CREATE TABLE type_document_table (
    id_type_document SERIAL PRIMARY KEY,
    type_document_name VARCHAR(45) NOT NULL UNIQUE
);

--Create table "type_of_information_table" with ID and name of the type of information
CREATE TABLE type_of_information_table (
    id_type_of_information SERIAL PRIMARY KEY,
    type_of_information_name VARCHAR(90) NOT NULL UNIQUE
);

-- Crear tabla "countries_table" con ID y nombre del país
CREATE TABLE countries_table (
    id_country SERIAL PRIMARY KEY,
    country_name_en VARCHAR(90) NOT NULL,
    country_name_es VARCHAR(90) NOT NULL,
    country_iso2 VARCHAR(45) UNIQUE NOT NULL,
    country_iso3 VARCHAR(45) UNIQUE NOT NULL,
    country_numericcode VARCHAR(45) UNIQUE NOT NULL,
    country_phonecode VARCHAR(45) NOT NULL
);

-- Crear tabla "climates_table" con ID y nombre del clima
CREATE TABLE climates_table (
    id_climate SERIAL PRIMARY KEY,
    climate_name VARCHAR(45) NOT NULL UNIQUE
);

-- Crear tabla "coffee_profile_table" con ID y nombre del perfil de café
CREATE TABLE coffee_profile_table (
    id_profile SERIAL PRIMARY KEY,
    profile_name VARCHAR(45) NOT NULL UNIQUE
);

-- Crear tabla "coffee_variations_table" con ID y nombre de la variedad de café
CREATE TABLE coffee_variations_table (
    id_variety SERIAL PRIMARY KEY,
    variety_name VARCHAR(45) NOT NULL UNIQUE
);

-- Crear tabla "roasting_type_table" con ID y nombre del tipo de tostado
CREATE TABLE roasting_type_table (
    id_roast SERIAL PRIMARY KEY,
    roasting_name VARCHAR(45) NOT NULL UNIQUE
);

-- Crear tabla "roles_table" con ID y nombre del rol
CREATE TABLE roles_table (
    id_role SERIAL PRIMARY KEY,
    role_name VARCHAR(45) NOT NULL UNIQUE
);

-- Crear tabla "associations" con ID, nombre y situación únicos
CREATE TABLE associations_table (
    id_association SERIAL PRIMARY KEY,
    association_name VARCHAR(45) NOT NULL,
    association_situation BOOLEAN NOT NULL
);

CREATE TABLE offer_status_table (
    id_offer_status SERIAL PRIMARY KEY,
    offer_status_name VARCHAR(250) NOT NULL
);

CREATE TABLE currencies_table (
    id_currency SERIAL PRIMARY KEY,
    currency_name VARCHAR(250) NOT NULL,
    currency_isocode VARCHAR(25) NOT NULL
);

CREATE TABLE activation_status_table (
    id_activation_status SERIAL PRIMARY KEY,
    activation_status_name VARCHAR(250) NOT NULL
);

CREATE TABLE news_type_table(
    id_news_type SERIAL PRIMARY KEY,
    news_type_ocurrence VARCHAR(50)
);

--TABLAS RELACIONALES
-- Crear tabla "states_table" con ID y nombre del estado
CREATE TABLE states_table (
    id_state SERIAL PRIMARY KEY,
    id_country SMALLINT REFERENCES countries_table(id_country),
    state_name VARCHAR(90) NOT NULL
);

-- Crear tabla "cities_table" con ID y nombre de la ciudad
CREATE TABLE cities_table (
    id_city SERIAL PRIMARY KEY,
    id_state SMALLINT REFERENCES states_table(id_state),
    city_name VARCHAR(90) NOT NULL
);

-- Crear tabla "villages_table" con ID y nombre de la aldea
CREATE TABLE villages_table (
    id_village SERIAL PRIMARY KEY,
    id_city SMALLINT REFERENCES cities_table(id_city),
    village_name VARCHAR(90) NOT NULL
);

-- Crear tabla "user_gender" con ID y nombre del género
CREATE TABLE user_gender(
    id_user_gender SERIAL PRIMARY KEY,
    user_gender_name VARCHAR(45) NOT NULL
);

-- Crear tabla "users_table" con IDs de estado y país
CREATE TABLE users_table (
    id_user SERIAL PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    user_phone VARCHAR(20) NOT NULL,
    user_email VARCHAR(55) NOT NULL UNIQUE,
    id_user_gender SMALLINT REFERENCES user_gender(id_user_gender),
    user_username VARCHAR(90) NOT NULL UNIQUE,
    user_password VARCHAR(250) NOT NULL,
    user_profile_photo VARCHAR(250),
    user_cover_photo VARCHAR(250),
    id_type_document SMALLINT REFERENCES type_document_table(id_type_document),
    number_document VARCHAR(20) NOT NULL UNIQUE,
    postal_code INTEGER,
    id_state SMALLINT REFERENCES states_table(id_state),
    users_created_at DATE NOT NULL DEFAULT NOW(),
    users_updated_at DATE ,
    user_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    id_role SMALLINT REFERENCES roles_table(id_role) DEFAULT 1,
    register_from_google BOOLEAN NOT NULL DEFAULT FALSE,
    learning_style VARCHAR(45)
);

-- Crear tabla "users_roles" con ID de usuario y ID de rol
CREATE TABLE user_role (
    id_user_role SERIAL PRIMARY KEY,
    id_user SMALLINT REFERENCES users_table(id_user),
    id_role SMALLINT REFERENCES roles_table(id_role),
    UNIQUE (id_user, id_role)
);

-- Crear tabla "user_login_attempts" con id_user, failed attemps, last_failed_attempt
CREATE TABLE user_login_attempts (
    id_user_login SERIAL PRIMARY KEY,
    failed_attempts INTEGER DEFAULT 0,
    last_failed_attempt TIMESTAMP DEFAULT NULL,
    id_user SMALLINT REFERENCES users_table(id_user)
);

-- Crear tabla "user_creation" con dos id_user donde el primero es el usuario que crea y el segundo es el usuario creado
CREATE TABLE user_creation (
    id_user_creation SERIAL PRIMARY KEY,
    id_user SMALLINT REFERENCES users_table(id_user),
    id_user_created_by SMALLINT REFERENCES users_table(id_user)
);

-- Crear tabla "users_documentation" 
CREATE TABLE users_documentation (
    id_user SMALLINT REFERENCES users_table(id_user) PRIMARY KEY,
    user_identification_document VARCHAR(250),
    user_rut_identification VARCHAR(250),
    user_tax_identification VARCHAR(250) UNIQUE
);

CREATE TABLE user_information_table (
    id_user_information SERIAL PRIMARY KEY,
    id_user SMALLINT REFERENCES users_table(id_user),
    id_type_of_information SMALLINT REFERENCES type_of_information_table(id_type_of_information),
    user_personal_description_text TEXT
);

CREATE TABLE businesman_coffee_interested (
    id_user SMALLINT REFERENCES users_table(id_user) PRIMARY KEY,
    id_profile SMALLINT REFERENCES coffee_profile_table(id_profile),
    id_roast SMALLINT REFERENCES roasting_type_table(id_roast),
    id_city SMALLINT REFERENCES cities_table(id_city)
);


-- Crear tabla "farms_table" con ID, nombre, cantidad de lotes, ID de aldea y ID de usuario
CREATE TABLE farms_table (
    id_farm SERIAL PRIMARY KEY,
    id_user INTEGER REFERENCES users_table(id_user),
    farm_name VARCHAR(45) NOT NULL,
    farm_number_lots SMALLINT NOT NULL,
    farm_longitude REAL,
    farm_latitude REAL,
    farm_created_at DATE NOT NULL DEFAULT NOW(),
    farm_updated_at DATE ,
    farm_deleted_at DATE ,
    id_village INTEGER REFERENCES villages_table(id_village),
    name_provided_by_user VARCHAR(45),
    farm_status BOOLEAN DEFAULT TRUE
);

-- Crear tabla "farms_additional_info" con ID, longitud, latitud, registro comercial, fotos, altitud, clima y situación
CREATE TABLE farms_additional_info (
    id_farm_additional_info SERIAL PRIMARY KEY,
    id_farm SMALLINT REFERENCES farms_table(id_farm) ,
    altitude VARCHAR(50) NOT NULL ,
    climate VARCHAR(30) NOT NULL ,
    temperature VARCHAR(100) NOT NULL 
);

CREATE TABLE farm_photos (
    id_farm SMALLINT REFERENCES farms_table(id_farm) PRIMARY KEY,
    farm_photo_1 VARCHAR(250),
    farm_photo_2 VARCHAR(250),
    farm_photo_3 VARCHAR(250)
);

-- Crear tabla "lot_table" con ID, ID de variedad, ID de perfil, ID de asociación, cantidad disponible, ID de tostado, descripción de producción, certificados y referencia de producto
CREATE TABLE lot_table (
    id_lot SERIAL PRIMARY KEY,
    id_farm SMALLINT REFERENCES farms_table(id_farm),
    lot_number SMALLINT NOT NULL,
    id_variety SMALLINT REFERENCES coffee_variations_table(id_variety),
    id_profile SMALLINT REFERENCES coffee_profile_table(id_profile),
    id_roast SMALLINT REFERENCES roasting_type_table(id_roast),
    is_completed BOOLEAN DEFAULT FALSE,
    lot_created_at DATE NOT NULL DEFAULT NOW(),
    lot_updated_at DATE ,
    lot_deleted_at DATE ,
    lot_status BOOLEAN DEFAULT TRUE, 
    lot_coding VARCHAR(60)
);

-- Crear tabla "lot_quantity"
CREATE TABLE lot_quantity (
    id_lot_quantity SERIAL PRIMARY KEY,
    id_lot SMALLINT REFERENCES lot_table(id_lot),
    total_quantity SMALLINT NOT NULL,
    samples_quantity SMALLINT NOT NULL,
    id_association SMALLINT REFERENCES associations_table(id_association),
    lot_quantity_created_at DATE NOT NULL DEFAULT NOW(),
    lot_quantity_updated_at DATE ,
    lot_quantity_deleted_at DATE ,
    price_per_kilo REAL NOT NULL
);

-- Crear tabla "lot_summary"
CREATE TABLE lot_summary (
    id_lot_summary SERIAL PRIMARY KEY,
    id_lot SMALLINT REFERENCES lot_table(id_lot),
    germination_summary TEXT,
    sown_summary TEXT,
    harvest_summary TEXT,
    drying_summary TEXT,
    roasting_summary TEXT,
    packaging_summary TEXT
);

-- Crear tabla "lot_photo" con ID, fotos
CREATE TABLE lot_photo (
    id_lot_photo SERIAL PRIMARY KEY,
    id_lot SMALLINT REFERENCES lot_table(id_lot) ,
    lot_photo VARCHAR(250) NOT NULL 
);

-- Crear tabla "farm_documentation" con ID, fotos
CREATE TABLE farm_documentation (
    id_farm_documentation SERIAL PRIMARY KEY,
    id_user SMALLINT REFERENCES users_table(id_user) ,
    farm_documentation_id_document VARCHAR(250) NOT NULL ,
    farm_documentation_rut VARCHAR(250) NOT NULL ,
    farm_documentation_chamber_commerce VARCHAR(250) NOT NULL 
);

-- Crear tabla "lot_certifications" con ID, certificado de cafe especial y certificado de catador
CREATE TABLE lot_certifications (
    id_lot_certifications SERIAL PRIMARY KEY,
    id_lot SMALLINT REFERENCES lot_table(id_lot) ,
    product_sc_certificate VARCHAR(250) NULL ,
    product_taster_certificate VARCHAR(250) NULL ,
    contact_qgrader BOOLEAN NOT NULL DEFAULT FALSE
);

-- Crear tabla "score_lot_table" con ID, id_lot (dependiente de la tabla lot_table), user, score
CREATE TABLE score_lots (
    id_score_lots SERIAL PRIMARY KEY,
    id_lot SMALLINT REFERENCES lot_table(id_lot),
    id_user SMALLINT REFERENCES users_table(id_user),
    score SMALLINT NOT NULL
);

--product_situation BOOLEAN NOT NULL , 
--product_referenceNumber VARCHAR(45) NOT NULL
-- Crear tabla 'current_window_table' con user_id, current_window_id y farm_number_lot_table referenciando a la tabla 'users_table' y 'farms_table'
CREATE TABLE current_window_table (
    id_current_window SERIAL PRIMARY KEY,
    id_user SMALLINT REFERENCES users_table(id_user),
    current_window_id SMALLINT DEFAULT 0,
    current_farm_number_lot SMALLINT DEFAULT 0
);

-- Crear tabla 'purchase_table' con id_purchase from_user_id, to_user_id, id_farm, lot_number (dependiente de la tabla lot_table), quantity, purchase_date, purchase_status, payment_method, shipping_address, additional_notes
CREATE TABLE purchase_table (
    id_purchase SERIAL PRIMARY KEY,
    id_seller INTEGER REFERENCES users_table(id_user),
    id_buyer INTEGER REFERENCES users_table(id_user),
    id_lot SMALLINT REFERENCES lot_table(id_lot),
    purchase_quantity SMALLINT NOT NULL,
    id_purchase_status SMALLINT REFERENCES purchase_status_options_table(id_purchase_status),
    id_shipping_option SMALLINT REFERENCES shipping_options_table(id_shipping_option),
    shipping_address VARCHAR(250) NOT NULL,
    additional_notes VARCHAR(250) NOT NULL,
    is_sample BOOLEAN NOT NULL DEFAULT FALSE,
    purchase_created_at DATE NOT NULL DEFAULT NOW(),
    purchase_updated_at DATE ,
    purchase_deleted_at DATE
);


-- Crear tabla 'cart_table' con id_cart, id_user, id_farm, lot_number (dependiente de la tabla lot_table), quantity, cart_date
CREATE TABLE cart_table (
    id_cart SERIAL PRIMARY KEY,
    id_seller INTEGER REFERENCES users_table(id_user),
    id_buyer INTEGER REFERENCES users_table(id_user),
    id_lot SMALLINT REFERENCES lot_table(id_lot),
    is_in_purchase BOOLEAN NOT NULL DEFAULT FALSE,
    cart_created_at DATE NOT NULL DEFAULT NOW(),
    cart_updated_at DATE ,
    cart_deleted_at DATE
);

-- Crear tabla "score_users" con ID, id_user (dependiente de la tabla users_table), user, score
CREATE TABLE score_users (
    id_score_users SERIAL PRIMARY KEY,
    id_user SMALLINT REFERENCES users_table(id_user),
    id_user_score SMALLINT REFERENCES users_table(id_user),
    score SMALLINT NOT NULL
);

CREATE TABLE make_offer_table (
    id_make_offer SERIAL PRIMARY KEY,
    id_seller SMALLINT REFERENCES users_table(id_user),
    id_buyer SMALLINT REFERENCES users_table(id_user),
    id_lot SMALLINT REFERENCES lot_table(id_lot),
    id_offer_status SMALLINT REFERENCES offer_status_table(id_offer_status),
    offer_created_at DATE NOT NULL DEFAULT NOW(),
    offer_updated_at DATE ,
    offer_deleted_at DATE 
);

CREATE TABLE course_table (
    id_course SERIAL PRIMARY KEY,
    course_title VARCHAR(100) NOT NULL,
    course_description VARCHAR(1500),
    course_duration VARCHAR(250),
    course_instructor_name VARCHAR(50),
    course_price INTEGER NOT NULL,
    course_curriculum_file VARCHAR(250) NOT NULL,
    course_start_date DATE NOT NULL,
    course_photo VARCHAR(250),
    course_video VARCHAR(250),
    course_created_at DATE NOT NULL DEFAULT NOW(),
    course_updated_at DATE,
    course_status BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE course_objectives_table (
    id_objective SERIAL PRIMARY KEY,
    objective_text VARCHAR(1000) NOT NULL,
    id_course INTEGER REFERENCES course_table(id_course)
);

CREATE TABLE module_table (
    id_module SERIAL PRIMARY KEY,
    module_title VARCHAR(250) NOT NULL,
    module_description VARCHAR(500),
    module_created_at DATE NOT NULL DEFAULT NOW(),
    module_updated_at DATE,
    module_status BOOLEAN NOT NULL DEFAULT TRUE,
    id_course INTEGER REFERENCES course_table(id_course)
);

CREATE TABLE submodule_table (
    id_submodule SERIAL PRIMARY KEY,
    submodule_title VARCHAR(250) NOT NULL,
    submodule_summary VARCHAR(500) NOT NULL,
    submodule_resources VARCHAR(500),
    submodule_class_video VARCHAR(250),
    submodule_created_at DATE NOT NULL DEFAULT NOW(),
    submodule_updated_at DATE,
    submodule_status BOOLEAN NOT NULL DEFAULT TRUE,
    id_module INTEGER REFERENCES module_table(id_module) NOT NULL
);

CREATE TABLE submodule_question_table (
    id_question SERIAL PRIMARY KEY,
    question_content VARCHAR(250) NOT NULL,
    id_submodule INTEGER REFERENCES submodule_table(id_submodule),
    question_description VARCHAR(500)
);

CREATE TABLE submodule_answer_table (
    id_answer SERIAL PRIMARY KEY,
    answers_content VARCHAR(250) NOT NULL,
    answers_validity BOOLEAN NOT NULL DEFAULT FALSE,
    id_question INTEGER REFERENCES submodule_question_table(id_question)
);

CREATE TABLE user_submodule_progress (
    id SERIAL PRIMARY KEY,
    id_user INTEGER REFERENCES users_table(id_user),
    id_submodule INTEGER REFERENCES submodule_table(id_submodule),
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    success_rate SMALLINT
);

CREATE TABLE user_submodule_answers (
    id SERIAL PRIMARY KEY,
    id_user INTEGER REFERENCES users_table(id_user),
    id_submodule INTEGER REFERENCES submodule_table(id_submodule),
    id_question INTEGER REFERENCES submodule_question_table(id_question),
    validity BOOLEAN
);

CREATE TABLE users_courses_table (
    id_user INTEGER REFERENCES users_table(id_user),
    id_course INTEGER REFERENCES course_table(id_course),
    registration_date DATE NOT NULL DEFAULT NOW(),
    learner_opinion_about_course VARCHAR(500),
    progress_percent FLOAT DEFAULT 0,    
    PRIMARY KEY(id_user, id_course)
);

CREATE TABLE course_skills_table (
    id_skill SERIAL PRIMARY KEY,
    id_course INTEGER REFERENCES course_table(id_course),
    skill_name VARCHAR(500) NOT NULL
);

CREATE TABLE user_skill_preferences (
    id_preferences SERIAL PRIMARY KEY,
    id_skill INTEGER REFERENCES course_skills_table(id_skill),
    id_user INTEGER REFERENCES users_table(id_user)
);

CREATE TABLE purchase_course_table (
    id_purchase_course SERIAL PRIMARY KEY,
    id_seller INTEGER REFERENCES users_table(id_user),
    id_buyer INTEGER REFERENCES users_table(id_user),
    id_course SMALLINT REFERENCES course_table(id_course),
    id_purchase_status SMALLINT REFERENCES purchase_status_options_table(id_purchase_status),
    id_shipping_option SMALLINT REFERENCES shipping_options_table(id_shipping_option),
    shipping_address VARCHAR(250) NOT NULL,
    additional_notes VARCHAR(250) NOT NULL,
    purchase_created_at DATE NOT NULL DEFAULT NOW(),
    purchase_updated_at DATE ,
    purchase_deleted_at DATE
);

-- Crear tabla "news_events_table" para noticias y eventos
CREATE TABLE news_events_table (
    id_news_event SERIAL PRIMARY KEY,
    news_title VARCHAR(255) NOT NULL,
    news_image_url VARCHAR(500),
    news_video_url VARCHAR(500),
    news_reference_link VARCHAR(500),
    news_content_text TEXT NOT NULL,
    news_event_duration VARCHAR(50),
    news_publication_date TIMESTAMP NOT NULL DEFAULT NOW(),
    news_is_highlighted BOOLEAN NOT NULL DEFAULT FALSE,
    id_news_type SMALLINT REFERENCES news_type_table(id_news_type),
    id_user SMALLINT REFERENCES users_table(id_user)
);

CREATE TABLE coffee_country_preference (
    id_coffee_country_preference SERIAL PRIMARY KEY,
	id_country SMALLINT NOT NULL REFERENCES countries_table(id_country),
	id_profile SMALLINT NOT NULL REFERENCES coffee_profile_table(id_profile)
);

CREATE TABLE cart_course_table (
    id_cart_course SERIAL PRIMARY KEY,
    id_seller INTEGER REFERENCES users_table(id_user),
    id_buyer INTEGER REFERENCES users_table(id_user),
    id_course INTEGER REFERENCES course_table(id_course),
    is_in_purchase BOOLEAN NOT NULL DEFAULT FALSE,
    cart_created_at DATE NOT NULL DEFAULT NOW(),
    cart_updated_at DATE,
    cart_deleted_at DATE
);

--COMANDOS PARA LLENAR LAS TABLAS

--- user_gender
INSERT INTO 
    user_gender (user_gender_name)
VALUES 
    ('Masculino'),
    ('Femenino'),
    ('Otro');

--Association_table
INSERT INTO
    associations_table (association_name, association_situation)
VALUES
    ('Regional', 'true'),
    ('Páez convenciónal', 'true'),
    ('Paéz organico', 'true'),
    ('Grupo los seis', 'true'),
    ('Illy', 'true'),
    ('Cencoi Flo', 'true'),
    ('Rainforest Alliance', 'true'),
    ('Nespresso AAA', 'true'),
    ('Nespresso AAA (Incluye el cafe Pedregal, AA)"','true'),
    ('FLOFED Campesina', 'true'),
    ('Especial Generico Origen Páez', 'true'),
    ('Consurso desarrollo alternativo', 'true'),
    ('Organico', 'true'),
    ('RFA precertificado', 'true'),
    ('Taza de la excelencia', 'true'),
    ('Pergamino estándar', 'true'); 

-- Climates table
INSERT INTO
    climates_table (climate_name)
VALUES
    ('Árido'),
    ('Desértico'),
    ('Húmedo'),
    ('Semiárido'),
    ('Semihúmedo'),
    ('Superhúmedo'); 
    
-- Coffee profile
INSERT INTO
    coffee_profile_table (profile_name)
VALUES
    ('Caramelo'),
    ('Dulzón'),
    ('Cítrico'),
    ('Cuerpo Medio'),
    ('Cuerpo Alto'),
    ('Acidez'),
    ('Acidez media'),
    ('Acidez Buena'),
    ('Acidez Balanceada'),
    ('Cafe altura'),
    ('Cafe orgánico'),
    ('Taza limpia'),
    ('Panela'),
    ('Frutales'),
    ('Florales'),
    ('Amargo moderado'),
    ('Avinados'),
    ('Ahumados'),
    ('Picante similar al anis'); 
    
-- Coffee variations table
INSERT INTO
    coffee_variations_table (variety_name)
VALUES
    ('Arábica'),
    ('Blue Mountain'),
    ('Bourbon'),
    ('Castillo'),
    ('Catimor'),
    ('Catuai'),
    ('Caturra'),
    ('Ethiopian Heirloom'),
    ('Excelsa'),
    ('Geisha/Panamá'),
    ('Harrar'),
    ('Herencia Etíope'),
    ('Java'),
    ('Jember'),
    ('Liberica'),
    ('Maragogype'),
    ('Moka'),
    ('Mundo Novo'),
    ('Pacamara'),
    ('Robusta'),
    ('Sidamo'),
    ('SL24'),
    ('SL34'),
    ('Sumatra Mandheling'),
    ('Tekisik'),
    ('Toraja Kalosi'),
    ('Typica'),
    ('Villa Sarchi'),
    ('Yirgacheffe');
    
-- roasting type
INSERT INTO
    roasting_type_table (roasting_name)
VALUES
    ('Tueste claro'),
    ('Tueste medio'),
    ('Tueste medio oscuro'),
    ('Tueste oscuro'); 
    
-- roles table
INSERT INTO
    roles_table (role_name)
VALUES
    ('Caficultor'),
    ('Empresario'),
    ('Aprendiz'),
    ('Administrador');
    
-- type document table
INSERT INTO
    type_document_table (type_document_name)
VALUES
    ('Cédula de ciudadanía'),
    ('Cédula de extranjería'),
    ('Pasaporte'),
    ('Tarjeta de identidad');

INSERT INTO
    type_of_information_table (type_of_information_name)
VALUES
    ('user_brief_vision'),
    ('business_brief_vision'),
    ('business_reliable_provider'),
    ('business_brief_industry'),
    ('business_brief_future');

INSERT INTO
    purchase_status_options_table (status_name)
VALUES
    ('Pendiente'),
    ('Por confirmar'),
    ('Rechazada'),
    ('Aceptada'),
    ('Reembolsada'),
    ('Entrega pendiente'),
    ('En tránsito'),
    ('Entrega fallida'),
    ('Entregada'),
    ('Finalizada');

-- INSERT INTO
--     payment_method_options_table (method_name)
-- VALUES
--     ('Tarjeta de crédito'),
--     ('Tarjeta de débito'),
--     ('Transferencia bancaria'),
--     ('PayPal'),
--     ('Efectivo'),
--     ('Cheque'),
--     ('Criptomonedas'),
--     ('Pago contra entrega');

INSERT INTO
    shipping_options_table (shipping_option_name, shipping_option_price)
VALUES
    ('DHL', 9),
    ('Fedex', 9),
    ('UPS', 19);

INSERT INTO
    offer_status_table (offer_status_name)
VALUES
    ('Pendiente'),
    ('Aceptada'),
    ('Rechazada');

INSERT INTO 
    currencies_table (currency_name, currency_isocode) 
VALUES 
    ('Euro', 'EUR'), 
    ('Dólar estadounidense', 'USD'), 
    ('Peso colombiano', 'COP');

INSERT INTO 
    activation_status_table (activation_status_name) 
VALUES 
    ('activo'), 
    ('inactivo');

--- news_type_table
INSERT INTO 
    news_type_table (news_type_ocurrence)
VALUES 
    ('Noticia'),
    ('Evento'),
    ('Otro');