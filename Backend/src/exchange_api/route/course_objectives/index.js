exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const path = '/course_objectives';
    const pathGet = '/course_objectives/:id_objective';

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
            method: 'get',
            path: pathGet,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./get').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        },
        {
            method: 'get',
            path: path,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./get_all').handler,
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
        },
        {
            method: 'delete',
            path: pathGet,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./delete').handler,
            customWrappers: [
                trimInputMiddleware()
            ]
        },
    ];
};
