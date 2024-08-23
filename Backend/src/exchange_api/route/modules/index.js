exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const uploadFiles = require('this_pkg/upload');
    const path = '/modules';
    const pathGet = '/modules/:id_module';
    return [
        {
            method: 'post',
            path: path,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./post').handler,
            customWrappers: [
                trimInputMiddleware(),
                uploadFiles.uploadMultipleWrapper([
                    { name: 'module_resources', maxCount: 1 },
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
                    { name: 'module_resources', maxCount: 1 },
                ])]
        },
        {
            method: 'delete', 
            path: pathGet, 
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./delete').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        }
    ];
};
