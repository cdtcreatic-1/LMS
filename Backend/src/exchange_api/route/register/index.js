exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const uploadFiles = require('this_pkg/upload');
    const path = '/register';
    const pathGet = '/register/:id_user';
    return [
        {
            method: 'post',
            path: path,
            tokenAuthWrapper: tokenAuth.DISABLED,
            handler: require('./post').handler,
            customWrappers: [
                trimInputMiddleware(),
                uploadFiles.uploadMultipleWrapper([
                    { name: 'user_profile_photo', maxCount: 1 },
                ])]
        },
        {
            method: 'get',
            path: pathGet,
            tokenAuthWrapper: tokenAuth.DISABLED, //TODO: Cambiar a REQUIRED
            handler: require('./get').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        },
        {
            method: 'delete',
            path: path,
            tokenAuthWrapper: tokenAuth.OPTIONAL,
            handler: require('./delete').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        },
        {
            method: 'put',
            path: path,
            tokenAuthWrapper: tokenAuth.DISABLED,
            handler: require('./put').handler,
            customWrappers: [
                trimInputMiddleware(),
                uploadFiles.uploadMultipleWrapper([
                    { name: 'user_profile_photo', maxCount: 1 },
                ])]
        }
        
    ];
};
