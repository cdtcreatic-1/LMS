exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const uploadFiles = require('this_pkg/upload');
    const path = '/get_modules_by_id_course/:id_course';
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
