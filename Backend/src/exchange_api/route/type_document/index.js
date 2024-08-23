exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const path = '/type_document';
    return [
        {
            method: 'get',
            path: path,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./get').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        }
    ];
};
