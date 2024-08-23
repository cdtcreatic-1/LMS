exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const pathGet = '/get_tracking/:id_purchase';
    return [
        {
            method: 'get',
            path: pathGet,
            tokenAuthWrapper: tokenAuth.DISABLED, //TODO: Cambiar a REQUIRED
            handler: require('./get').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        }
    ];
};
