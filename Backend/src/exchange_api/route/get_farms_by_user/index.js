exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const path = '/get_farms_by_user/:id_user';
    const pathGet = '/get_farms_by_user/:id_farm';
    return [
        {
            method: 'get',
            path: path,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./get').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        },
        {
            method: 'delete',
            path: pathGet,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./delete').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        }
    ];
};