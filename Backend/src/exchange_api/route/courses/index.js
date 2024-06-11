exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const uploadFiles = require('this_pkg/upload');
    const path = '/courses';
    const pathGet = '/courses/:id_course';
    return [
        {
            method: 'post',
            path: path,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./post').handler,
            customWrappers: [
                trimInputMiddleware(),
                uploadFiles.uploadMultipleWrapper([
                    { name: 'course_photo', maxCount: 1 },
                    { name: 'course_curriculum_file', maxCount: 1 },
                ])]
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
            method: 'put',
            path: path,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./put').handler,
            customWrappers: [
                trimInputMiddleware(),
                uploadFiles.uploadMultipleWrapper([
                    { name: 'course_photo', maxCount: 1 },
                    { name: 'course_curriculum_file', maxCount: 1 },
                ])]
        },
        {
            method: 'get',
            path: '/course_recent/:id_user',
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./get_recent_courses').handler,
            customWrappers: [trimInputMiddleware()],
        }
    ];
};
