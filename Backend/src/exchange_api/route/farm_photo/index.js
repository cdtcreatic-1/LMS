exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const uploadFiles = require('this_pkg/upload');
    const path = '/farm_photos';
    return [
        {
            method: 'post',
            path: path,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./post').handler,
            customWrappers: [
                trimInputMiddleware(),
                uploadFiles.uploadMultipleWrapper([
                    { name: 'farm_photo_1', maxCount: 1 },
                    { name: 'farm_photo_2', maxCount: 1 },
                    { name: 'farm_photo_3', maxCount: 1 },
                ])]
        },
        {
            method: 'put',
            path: path,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./put').handler,
            customWrappers: [
                trimInputMiddleware(),
                uploadFiles.uploadMultipleWrapper([
                    { name: 'farm_photo_1', maxCount: 1 },
                    { name: 'farm_photo_2', maxCount: 1 },
                    { name: 'farm_photo_3', maxCount: 1 },
                ])]
        }
    ];
};
