exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const path = '/login';
    return [
        {
            method: 'post',
            path: path,
            tokenAuthWrapper: tokenAuth.DISABLED,
            handler: require('./post').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        }
    ];
};
