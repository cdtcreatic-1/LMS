exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const pathUpdateScore = '/score_course';
    const pathGetScore = '/score_course/:id_user/:id_course';
    return [
        {
            method: 'put',
            path: pathUpdateScore,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./put').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        },
        {
            method: 'get',
            path: pathGetScore,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./get').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        }
    ];
};
