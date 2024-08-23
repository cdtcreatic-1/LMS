
exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const path = '/register_farm';
    return [
        {
            method: 'post',
            path: path,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./post').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        },
        {
            method: 'put',
            path: path,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./put').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        }
    ];
};
