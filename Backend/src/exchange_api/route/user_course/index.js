exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const path = '/user_course';
    const pathWithIds = '/user_course/:id_user/:id_course';
    const pathUser = '/user_course/:id_user';
    const get_completed_courses = '/get_completed_courses/:id_user';
    const get_recently_purchases = '/get_recently_purchases/:id_user';
    const pathCourse = '/user_course/:id_course';
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
            path: pathWithIds,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./get').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        },
        {
            method: 'delete',
            path: pathWithIds,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./delete').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        },
        {
            method: 'get',
            path: pathUser,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./get_user_courses').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        },
        {
            method: 'get',
            path: pathCourse,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./get_course_users').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        },
        {
            method: 'get',
            path: get_completed_courses,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./get_completed_courses').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        },
        {
            method: 'get',
            path: get_recently_purchases,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./get_recently_purchases').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        }

    ];
};
