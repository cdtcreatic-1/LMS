exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const uploadFiles = require('this_pkg/upload');
    const path = '/parse_ref';

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
    ];
};
