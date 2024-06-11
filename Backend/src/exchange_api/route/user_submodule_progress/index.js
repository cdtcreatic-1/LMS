exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const path = '/user-submodule-progress';
    const pathGetById = '/user-submodule-progress/:id';
    const pathGetByUser = '/user-submodule-progress/user/:id_user';
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
            path: pathGetById,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./get').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        },
        /*{
            method: 'get',
            path: pathGetByUser,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./getByUser').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        },*/
        {
            method: 'put',
            path: path,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./put').handler,
            customWrappers: [
                trimInputMiddleware()
            ]
        }
    ];
};
