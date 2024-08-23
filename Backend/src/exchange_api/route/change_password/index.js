exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const path = '/change_password';
    return [
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
