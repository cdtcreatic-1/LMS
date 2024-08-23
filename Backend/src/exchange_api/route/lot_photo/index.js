exports.getRoutes = () => {
  const { trimInputMiddleware } = require('cccommon/utils');
  const tokenAuth = require('this_pkg/auth/token');
  const uploadFiles = require('this_pkg/upload');
  const path = '/lot_photo';
  const pathWithID = '/lot_photo/:id_lot';

  return [
    {
      method: 'post',
      path: path,
      tokenAuthWrapper: tokenAuth.REQUIRED,
      handler: require('./post').handler,
      customWrappers: [
        trimInputMiddleware(),
        uploadFiles.uploadMultipleWrapper([
          { name: 'lot_photo', maxCount: 1 }
        ])
      ]
    },
    {
      method: 'put',
      path: pathWithID,
      tokenAuthWrapper: tokenAuth.REQUIRED,
      handler: require('./put').handler,
      customWrappers: [
        trimInputMiddleware(),
        uploadFiles.uploadMultipleWrapper([
          { name: 'lot_photo', maxCount: 1 }
        ])
      ]
    },
    {
      method: 'get',
      path: pathWithID,
      tokenAuthWrapper: tokenAuth.REQUIRED,
      handler: require('./get').handler,
      customWrappers: [
        trimInputMiddleware(),
      ]
    }
  ];
};
