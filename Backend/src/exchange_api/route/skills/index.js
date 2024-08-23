exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const path = '/skills';
    const pathGet = '/skills/:id_skill';

    return [
        {
            method: 'post',
            path: path,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./post').handler,
            customWrappers: [
                trimInputMiddleware()
            ]
        },
        {
            method: 'get',
            path: pathGet,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./get').handler,
            customWrappers: [
                trimInputMiddleware()
            ]
        },
        {
            method: 'put',
            path: path,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./put').handler,
            customWrappers: [
                trimInputMiddleware()
            ]
        },
        {
            method: 'delete',
            path: pathGet,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./delete').handler,
            customWrappers: [
                trimInputMiddleware()
            ]
        },
        {
            method: 'get',
            path: path,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./get_all').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        }
    ];
};
