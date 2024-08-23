
/**
 * @fileoverview Configuration file for the exchange_api subsystem.
 * @author Dario Hernandez
 * @version 1.0
 * @license Creatic TODO: Add license 
 * @description This file contains the configuration for the exchange_api subsystem.
 */

/******************************************************************************
subsystem : logging
******************************************************************************/
exports.production = {};

exports.is_production = function () {
  if (process.env.enviroment_deploy === 'production') {
    return true;
  }
  else {
    return false;
  }

};

exports.url_apify_api = function () {
  if (!process.env.url_apify) {
    throw new Error("could not find env var url_apify !");
  }
  return process.env.url_apify;
}

exports.url_redirect = function () {
  if (!process.env.url_redirect) {
    throw new Error("could not find env var url_redirect !");
  }
  return process.env.url_redirect;
}

exports.apify_public_key = function () {
  if (!process.env.PUBLIC_KEY) {
    throw new Error("could not find env var PUBLIC_KEY !");
  }
  return process.env.PUBLIC_KEY;
}

exports.apify_private_key = function () {
  if (!process.env.PRIVATE_KEY) {
    throw new Error("could not find env var PRIVATE_KEY !");
  }
  return process.env.PRIVATE_KEY;
}

exports.frontend_host = function () {
  if (!process.env.frontend_host) {
    throw new Error("could not find env var frontend_host !");
  }
  return process.env.frontend_host;
}


exports.app_url = function () {
  if (!process.env.app_url) {
    throw new Error("could not find env var app_url !");
  }
  return process.env.app_url;
}


exports.logging = {};
exports.logging.build_info = function () {
  return "FEX_23.04.10";
}

exports.logging.env_info = function () {
  if (!process.env.gva_logging_env_info) {
    throw new Error("couldnt find env var gva_logging_env_info !");
  }
  return process.env.gva_logging_env_info;
}


/******************************************************************************
subsystem : postgreSQL
******************************************************************************/
exports.postgreSQL = {
  connection: () => {

    if ((!process.env.exchange_db_username) ||
      (!process.env.exchange_db_password) ||
      (!process.env.exchange_db_database) ||
      (!process.env.exchange_db_host)) {
      throw new Error("could find one or more of env vars: exchange_db_type, exchange_db_username," +
        " exchange_db_password, exchange_db_database, exchange_db_host, SET THESE!!");
    }

    var username = process.env.exchange_db_username;
    var password = process.env.exchange_db_password;
    var database = process.env.exchange_db_database;
    var host = process.env.exchange_db_host;

    let postgreSQLStruct = {
      logging: false,
      username: username,
      password: password,
      database: database,
      host: host,

      dialect: 'postgres',
      ssl: false,
      dialectOptions: {
        ssl: false
      },

      pool: {
        max: 100,
        min: 0,
        // Milliseconds of idleness before a connection is eligible for eviction
        idle: 500,
        // How often, in milliseconds, "evictor" logic runs and evicts based on other config
        evict: 250
      },

    };

    return postgreSQLStruct;
  }
};

/***************************************************************
 Subsystem: exchange_api
 **************************************************************/
exports.exchange_api = {
  exposeDeveloperEndpoints: () => {
    return process.env.exchange_api_expose_developer_endpoints === 'YES_ALLOW_USERS_TO_ACCESS_DEVELOPER_ENDPOINTS';
  },
  http: () => {
    const cors = {};

    // Comma-separated list of Access-Control-Allow-Origin host strings.
    if (process.env.exchange_api_http_cors_allow_origin) {
      cors.origin = process.env.exchange_api_http_cors_allow_origin;
    }

    let port;

    if (process.env.exchange_api_http_port) {
      port = process.env.exchange_api_http_port;
    } else {
      port = 3000;
    }

    return {
      json: () => {
        return {
          limit: '5mb'
        };
      },
      cors: cors,

      requestLog: {
        enabled: true,
        scope: {
          body: true,
          headers: true,
          query: true,
        }
      },

      port: parseInt(port, 10)
    };
  }
};


/******************************************************************************
subsystem : https
******************************************************************************/
exports.https = {};
exports.https.enable = function () {
  if (!process.env.exchange_https) {
    throw new Error("could not find env var exchange_https !");
  }
  return process.env.exchange_https;
};
exports.https.crt_file = function () {
  if (!process.env.exchange_https_crt_file) {
    throw new Error("could not find env var exchange_https_crt_file !");
  }
  return process.env.exchange_https_crt_file;
};
exports.https.key_file = function () {
  if (!process.env.exchange_https_key_file) {
    throw new Error("could not find env var exchange_https_key_file !");
  }
  return process.env.exchange_https_key_file;
};
exports.https.ca_bundle_file = function () {
  if (!process.env.exchange_https_ca_bundle_file) {
    throw new Error("could not find env var exchange_https_ca_bundle_file !");
  }
  return process.env.exchange_https_ca_bundle_file;
};
