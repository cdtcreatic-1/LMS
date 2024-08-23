exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const path = '/farmer_profile/:id_user';
    const pathPut = '/farmer_profile';
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
            method: 'patch',
            path: pathPut,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./patch').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        }
    ];

};