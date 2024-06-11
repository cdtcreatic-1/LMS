exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const path = '/course_skills';
    const pathGetSkill = '/course_skills/:id_skill';
    const pathGetCourse = '/course_skills/:id_course';

    return [
        {
            method: 'post',
            path: path,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./post').handler,
            customWrappers: [
                trimInputMiddleware()
            ]
        },
        {
            method: 'get',
            path: pathGetSkill,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./get_all_skill').handler,
            customWrappers: [
                trimInputMiddleware()
            ]
        },
        {
            method: 'get',
            path: pathGetCourse,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./get_all_course').handler,
            customWrappers: [
                trimInputMiddleware()
            ]
        },
        {
            method: 'delete',
            path: pathGetSkill,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./delete').handler,
            customWrappers: [
                trimInputMiddleware()
            ]
        },
    ];
};
