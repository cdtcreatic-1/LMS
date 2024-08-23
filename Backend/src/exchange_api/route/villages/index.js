exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const path = '/villages';
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
        /*{
            method: 'put',
            path: path,
            tokenAuthWrapper: tokenAuth.DISABLED,
            handler: require('./put').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        }*/
        
    ];
};
