/**
 * HTTP server for the exchange API.
 * 
 */
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const addRequestId = require('express-request-id')();
const swaggerUi = require('swagger-ui-express');
const through2 = require('through2');
const cors = require('cors');
const commonConfig = require('cccommon/config');
const appErr = require('./error');

const { startEmail } = require('cccommon/utils');
const swaggerDocument = require('./green_trade_swagger.json');
const usersCrone = require('this_pkg/users');

/**
 * Read from the configuration 
 * 
 * Thin wrapper around the common config module.
 * 
 * @return {Object} - The configuration object for the HTTP server.
 */
exports.getConfig = () => {
    return commonConfig.exchange_api.http();
};

exports.configureCors = (app, httpConfig) => {

    //Willcard may be used to allow all origins.
    let origin = '*';

    if (httpConfig && httpConfig.cors && httpConfig.cors.origin) {
        origin = [];
        httpConfig.cors.origin.split(',').forEach(pattern => {
            if (pattern) {
                origin.push(pattern);
            }
        });
    }

    app.use(cors({
        origin: origin,

        allowedHeaders: [
            'Content-Type',
            'Authorization'
        ],

        //Based on what cors is doing, use 200 (OK) instead of 204 (No Content) to support legacy browsers like IE11.
        optionsSuccessStatus: 200
    }));
};

exports.addRoutes = (app) => {
    let routeDefs = [];

    // All route modules return an array of route definitions. (POJOs
    // with a path and a handler function.)
    routeDefs = routeDefs.concat(require('./route/register').getRoutes());
    routeDefs = routeDefs.concat(require('./route/login').getRoutes());
    routeDefs = routeDefs.concat(require('./route/register_farm').getRoutes());
    routeDefs = routeDefs.concat(require('./route/farm_documentation').getRoutes());
    routeDefs = routeDefs.concat(require('./route/current_window_data').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_cities').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_villages').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_climates').getRoutes());
    routeDefs = routeDefs.concat(require('./route/user_information').getRoutes());
    routeDefs = routeDefs.concat(require('./route/modify_user_information').getRoutes());
    routeDefs = routeDefs.concat(require('./route/register_lots').getRoutes());
    routeDefs = routeDefs.concat(require('./route/coffee_info_data').getRoutes());
    routeDefs = routeDefs.concat(require('./route/serve_files').getRoutes());

    routeDefs = routeDefs.concat(require('./route/cover_photo').getRoutes());
    routeDefs = routeDefs.concat(require('./route/user_photo').getRoutes());
    routeDefs = routeDefs.concat(require('./route/farm_photo').getRoutes());
    routeDefs = routeDefs.concat(require('./route/change_password').getRoutes());

    routeDefs = routeDefs.concat(require('./route/get_countries').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_states').getRoutes());

    routeDefs = routeDefs.concat(require('./route/type_document').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_farmers').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_num_lots').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_coffee_variety').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_coffee_profile').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_coffee_roasting').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_association').getRoutes());
    routeDefs = routeDefs.concat(require('./route/lot_quantity').getRoutes());
    routeDefs = routeDefs.concat(require('./route/lot_summary').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_lot_info').getRoutes());
    routeDefs = routeDefs.concat(require('./route/businesman_coffee_interested').getRoutes());
    routeDefs = routeDefs.concat(require('./route/farmer_profile').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_lots_by_user').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_farms_by_user').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_purchase_options').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_payment_options').getRoutes());
    routeDefs = routeDefs.concat(require('./route/purchase').getRoutes());
    routeDefs = routeDefs.concat(require('./route/current_window_information').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_coordinates_by_id_village').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_id_village_by_coordinates').getRoutes());
    routeDefs = routeDefs.concat(require('./route/cart').getRoutes());
    routeDefs = routeDefs.concat(require('./route/lot_photo').getRoutes());
    routeDefs = routeDefs.concat(require('./route/delete_farms_by_id_farm').getRoutes());
    routeDefs = routeDefs.concat(require('./route/delete_lot_by_id_lot').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_shipping_options').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_lot_by_id_lot').getRoutes());
    routeDefs = routeDefs.concat(require('./route/score_lots').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_climate_and_temperature').getRoutes());
    routeDefs = routeDefs.concat(require('./route/lot_certifications').getRoutes());
    routeDefs = routeDefs.concat(require('./route/farm_documentation').getRoutes());
    routeDefs = routeDefs.concat(require('./route/farms_additional_info').getRoutes());
    // routeDefs = routeDefs.concat(require('./route/lot_offer_status_data').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_documentation_by_id_user').getRoutes());
    routeDefs = routeDefs.concat(require('./route/news_event').getRoutes());

    routeDefs = routeDefs.concat(require('./route/notification_for_businessman').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_coffee_recommended_prices').getRoutes());
    routeDefs = routeDefs.concat(require('./route/train_model_recommended_engine').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_prediction_for_recommended_engine').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_all_businessman').getRoutes());

    routeDefs = routeDefs.concat(require('./route/send_email_recovery_password').getRoutes());
    routeDefs = routeDefs.concat(require('./route/verify_token').getRoutes());
    routeDefs = routeDefs.concat(require('./route/change_purchase_status').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_notifications_for_farmer').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_purchase_status_table').getRoutes());
    routeDefs = routeDefs.concat(require('./route/user_role').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_user_trends').getRoutes());
    routeDefs = routeDefs.concat(require('./route/serve_charts').getRoutes());
    // Perform basic validation on the route definitions.
    routeDefs = routeDefs.concat(require('./route/get_tracking').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_users_paginated').getRoutes());
    routeDefs = routeDefs.concat(require('./route/courses').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_all_courses').getRoutes());
    routeDefs = routeDefs.concat(require('./route/course_objectives').getRoutes());
    routeDefs = routeDefs.concat(require('./route/course_learnings').getRoutes());
    routeDefs = routeDefs.concat(require('./route/modules').getRoutes());
    routeDefs = routeDefs.concat(require('./route/submodules').getRoutes());
    routeDefs = routeDefs.concat(require('./route/submodule_evaluation').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_all_courses_by_apprentice_id').getRoutes());
    routeDefs = routeDefs.concat(require('./route/submodule_question').getRoutes());
    routeDefs = routeDefs.concat(require('./route/submodule_answer').getRoutes());
    routeDefs = routeDefs.concat(require('./route/skills').getRoutes());
    routeDefs = routeDefs.concat(require('./route/user_skill_preferences').getRoutes());
    routeDefs = routeDefs.concat(require('./route/course_skills').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_sorted_lots_based_on_buyer_preferences').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_courses_by_skill_user').getRoutes());
    routeDefs = routeDefs.concat(require('./route/parse_ref').getRoutes());
    routeDefs = routeDefs.concat(require('./route/parse_ref_course').getRoutes());
    routeDefs = routeDefs.concat(require('./route/auth_change_password').getRoutes());
    routeDefs = routeDefs.concat(require('./route/purchase_course').getRoutes());
    routeDefs = routeDefs.concat(require('./route/consume_farmer_profile_data_microservice').getRoutes());
    routeDefs = routeDefs.concat(require('./route/consume_businessman_profile_data_microservice').getRoutes());
    routeDefs = routeDefs.concat(require('./route/consume_learner_profile_data_microservice').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_objectives_by_id_course').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_skills_by_id_course').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_modules_by_id_course').getRoutes());
    routeDefs = routeDefs.concat(require('./route/certificate_course').getRoutes());
    routeDefs = routeDefs.concat(require('./route/score_course').getRoutes());
    routeDefs = routeDefs.concat(require('./route/user_course').getRoutes());
    routeDefs = routeDefs.concat(require('./route/submodule_question_answer').getRoutes());
    routeDefs = routeDefs.concat(require('./route/user_submodule_progress').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_all_course_info_by_user').getRoutes());
    routeDefs = routeDefs.concat(require('./route/get_all_questions_and_answers').getRoutes());
    routeDefs = routeDefs.concat(require('./route/villages').getRoutes());

    //routeDefs = routeDefs.concat(require('./route/rating_evaluation_results').getRoutes());


    routeDefs.forEach(routeDef => {
        const defJson = JSON.stringify(routeDef, null, 2);

        if (!routeDef.method) {
            throw new Error(`Route definition is missing a method: ${defJson}`);
        }
        if (!routeDef.path) {
            throw new Error(`Route definition is missing a path: ${defJson}`);
        }
        if (!routeDef.handler) {
            throw new Error(`Route definition is missing a handler: ${defJson}`);
        }
        if (!routeDef.tokenAuthWrapper) {
            throw new Error(`Route definition is missing a tokenAuthWrapper: ${defJson}`);
        }

        if (routeDef.handler.init) {
            routeDef.handler.init();
        }

        let fHandler = routeDef.handler;

        if (Array.isArray(routeDef.customWrappers)) {
            routeDef.customWrappers.forEach(wrapper => {
                fHandler = wrapper(fHandler);
            });
        }

        fHandler = routeDef.tokenAuthWrapper(fHandler);
        //Add to routeDef.path the /api prefix if is production
        if (commonConfig.is_production()) {
            routeDef.path = '/api' + routeDef.path;
        }
        app[routeDef.method](routeDef.path, fHandler);

        app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        // app.use('/api/v1', fHandler);
    });
};

exports.configureApp = (app, httpConfig) => {

    app.use(addRequestId);

    morgan.token('id', (req) => {
        return req.id;
    });

    const morganOptions = {
        stream: through2((output, enc, callback) => {
            console.log(output.toString('utf8').trim());
            callback();
        })
    };

    app.use(morgan('[:date[clf]] ":method :url" :status :id :res[content-length] ":referrer" ":user-agent" :response-time ms :remote-addr - :remote-user', morganOptions));

    exports.configureCors(app, httpConfig);

    app.use(express.json(httpConfig.json()));
    app.use(exports.jsonParseErrHandler);

    app.use(express.urlencoded({ extended: true }));

    app.use(exports.createReqLogger(httpConfig));

    exports.addRoutes(app);

    app.use(exports.notFoundHandler);
    app.use(exports.errorHandler);

};

exports.notFoundHandler = (req, res) => {
    // console.log('Invalid route requested: ', appErr.addRequestIdToObj(req, {}));
    appErr.send(req, res, 'not_found');
};

exports.errorHandler = (err, req, res) => {
    const attrs = {
        err: {
            code: err.code,
            message: err.message,
            stack: err.stack
        }
    };
    // console.log('Unhandled error: ', appErr.addRequestIdToObj(req, attrs));
    appErr.send(req, res, 'server_error');
};

exports.createReqLogger = (httpConfig) => {
    return (req, res, next) => {
        if (!httpConfig.requestLog.enabled) {
            next();
            return;
        }

        const details = {
            protocol: req.protocol,
            method: req.method,
            path: req.path,
            originalUrl: req.originalUrl,
            ip: req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                (req.connection.socket ? req.connection.socket.remoteAddress : null)
        };

        if (httpConfig.requestLog.scope.body) {
            details.body = Object.assign({}, req.body);
        }
        if (httpConfig.requestLog.scope.headers) {
            details.headers = Object.assign({}, req.headers);
        }
        if (httpConfig.requestLog.scope.query) {
            details.query = Object.assign({}, req.query);
        }
        if (httpConfig.requestLog.scope.params) {
            details.params = Object.assign({}, req.params);
        }

        // console.log('requestLog', appErr.addRequestIdToObj(req.id, details));
        next();
    };
};




exports.jsonParseErrHandler = (err, req, res, next) => {
    if (!err) {
        next();
        return;
    }

    const details = {};

    if (err.message) {
        details.error = err.message;

        if (err.message === 'request entity too large') {
            const limit = exports.getConfig().json().limit;

            if (limit) {
                details.limit = limit;
            }
        }
    }

    appErr.send(req, res, 'bad_request', 'Request JSON could not be parsed.', details);
};




/**
 * Configure the Express app.
 * 
 */
exports.run = () => {
    const httpConfig = exports.getConfig();
    startEmail();
    usersCrone.cleanDisabledUsers();
    const app = express();

    exports.configureApp(app, httpConfig);

    if (commonConfig.https.enable() == 'disable') {
        app.listen(httpConfig.port);
        console.log(`HTTP server listening on port ${httpConfig.port}!`);
    } else {
        var privateKey = fs.readFileSync(commonConfig.https.key_file(), 'utf8');
        var certificate = fs.readFileSync(commonConfig.https.crt_file(), 'utf8');
        var certificateAuthority = [fs.readFileSync(commonConfig.https.ca_file())];
        var sslOptions = {
            key: privateKey,
            cert: certificate,
            ca: certificateAuthority,
            requestCert: true,
            rejectUnauthorized: false
        };
        var httpsServer = https.createServer(sslOptions, app);
        httpsServer.listen(httpConfig.port);
        console.log(`HTTPS server listening on port ${httpConfig.port}!`);
    }
};