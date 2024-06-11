exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const uploadFiles = require('this_pkg/upload');
    const path = '/user_role';
    const pathGet = '/user_role/:id_user';
    return [
        {
            method: 'post',
            path: path,
            tokenAuthWrapper: tokenAuth.DISABLED,
            handler: require('./post').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        },
        {
            method: 'put',
            path: path,
            tokenAuthWrapper: tokenAuth.DISABLED,
            handler: require('./put').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        },
        {
            method: 'get',
            path: pathGet,
            tokenAuthWrapper: tokenAuth.DISABLED, 
            handler: require('./get').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        }
    ];
};
