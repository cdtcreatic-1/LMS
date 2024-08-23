const userDal = require('cccommon/dal/user');
const appErr = require('this_pkg/error');
const ecUser = require('cccommon/user');


exports.REQUIRED = (handler) => {
    return async (req, res) => {
        let user;

        try {
            user = await exports.getUserByAuthHeader(req, res);
        } catch (err) {
            appErr.handleRouteServerErr(req, res, err, 'Error getting user by token');
            return;
        }

        if(!user){
            appErr.send(req, res, 'unauthorized');
            return;
        }

        await handler(req, res, user);
    };
};


exports.OPTIONAL = (handler) => {
    return async (req, res) => {
        let user;

        try {
            user = await exports.getUserByAuthHeader(req, res);
        } catch (err) {
            appErr.handleRouteServerErr(req, res, err, 'Error getting user by token');
            return;
        }

        await handler(req, res, user);
    };
};

exports.DISABLED = (handler) => {
    return async (req, res) => {
        await handler(req, res);
    };
};


exports.getUserByAuthHeader = async (req, res) => {
    let user;

    const authHeader = req.get('Authorization');
    if (!authHeader || !authHeader.match(/^Bearer \S+$/)) {
        return null;
    }

    const token = authHeader.slice(7);
    if (!token) {
        return null;
    }

    let decoded;
    try {
        // Verifica y decodifica el token
        decoded = ecUser.verifyToken(token);
        if (!decoded || !decoded.id_user) {
            return null;
        }
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'Error verifying token');
        return null;
    }

    try {
        // Busca al usuario por el id_user extraído del token
        user = await userDal.getUserByIdUser(decoded.id_user);
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'Error getting user by id');
        return null;
    }

    return user;
};