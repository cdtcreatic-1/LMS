exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const path = '/get_villages/:id_city';
    return [
        {
            method: 'get',
            path: path,
            tokenAuthWrapper: tokenAuth.REQUIRED, //TODO: Cambiar a REQUIRED
            handler: require('./get').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        }
    ];
};
