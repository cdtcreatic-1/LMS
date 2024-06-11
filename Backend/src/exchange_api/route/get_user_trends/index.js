exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const path = '/get_user_trends';
    return [
        {
            method: 'post',
            path: path,
            tokenAuthWrapper: tokenAuth.OPTIONAL,
            handler: require('./post').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        }
    ];
};