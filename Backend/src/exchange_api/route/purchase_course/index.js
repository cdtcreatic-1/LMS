exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const pathGet = '/purchase_course/:id_buyer';
    const pathPurchaseCourse = '/purchase_course';

    return [
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
            method: 'post',
            path: pathPurchaseCourse,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./post').handler,
            customWrappers: [
                trimInputMiddleware()
            ]
        }
    ];
};
