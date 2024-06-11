exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const uploadFiles = require('this_pkg/upload');
    const path = '/cart';
    const pathCartCourse = '/cart_course';
    const pathGet = '/cart/:id_buyer';
    const pathDelete = '/cart/:id_buyer/:id_lot';
    
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
            method: 'post',
            path: pathCartCourse,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./post_course').handler,
            customWrappers: [
                trimInputMiddleware()
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
            method: 'get',
            path: pathGet,
            tokenAuthWrapper: tokenAuth.REQUIRED, //TODO: Cambiar a REQUIRED
            handler: require('./get').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        },
        {
            method: 'get',
            path: `${pathCartCourse}/:id_buyer`,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./get_course').handler,
            customWrappers: [trimInputMiddleware()],
        },
        {
            method: 'delete',
            path: `${pathCartCourse}/:id_buyer/:id_course`,
            tokenAuthWrapper: tokenAuth.OPTIONAL,
            handler: require('./delete_course').handler,
            customWrappers: [trimInputMiddleware()],
        },
        {
            method: 'delete',
            path: pathDelete,
            tokenAuthWrapper: tokenAuth.OPTIONAL,
            handler: require('./delete').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        }
    ];
};
