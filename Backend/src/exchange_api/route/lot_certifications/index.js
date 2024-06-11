exports.getRoutes = () => {
  const { trimInputMiddleware } = require('cccommon/utils');
  const tokenAuth = require('this_pkg/auth/token');
  const uploadFiles = require('this_pkg/upload');
  const path = '/lot_certifications';
  const pathWithID = '/lot_certifications/:id_lot';

  return [
    {
      method: 'post',
      path: path,
      tokenAuthWrapper: tokenAuth.REQUIRED,
      handler: require('./post').handler,
      customWrappers: [
        trimInputMiddleware(),
        uploadFiles.uploadMultipleWrapper([
          { name: 'product_sc_certificate', maxCount: 1 },
          { name: 'product_taster_certificate', maxCount: 1 },
        ])]
    },
    {
      method: 'put',
      path: pathWithID,
      tokenAuthWrapper: tokenAuth.REQUIRED,
      handler: require('./put').handler,
      customWrappers: [
        trimInputMiddleware(),
        uploadFiles.uploadMultipleWrapper([
          { name: 'product_sc_certificate', maxCount: 1 },
          { name: 'product_taster_certificate', maxCount: 1 },
        ])]
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