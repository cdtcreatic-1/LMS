exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const path = '/verify_token/:token';
    return [
        {
            method: 'get',
            path: path,
            tokenAuthWrapper: tokenAuth.DISABLED,
            handler: require('./get').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        }
    ];
};
