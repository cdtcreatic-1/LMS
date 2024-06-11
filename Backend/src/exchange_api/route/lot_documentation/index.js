exports.getRoutes = () => {
  const { trimInputMiddleware } = require('cccommon/utils');
  const tokenAuth = require('this_pkg/auth/token');
  const uploadFiles = require('this_pkg/upload');
  const path = '/farm_documentation';
  const pathWithID = '/farm_documentation/:id_lot';

  return [
    {
      method: 'post',
      path: path,
      tokenAuthWrapper: tokenAuth.REQUIRED,
      handler: require('./post').handler,
      customWrappers: [
        trimInputMiddleware(),
        uploadFiles.uploadMultipleWrapper([
          { name: 'farm_documentation_id_document', maxCount: 1 },
          { name: 'farm_documentation_rut', maxCount: 1 },
          { name: 'farm_documentation_chamber_commerce', maxCount: 1 },
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
          { name: 'farm_documentation_id_document', maxCount: 1 },
          { name: 'farm_documentation_rut', maxCount: 1 },
          { name: 'farm_documentation_chamber_commerce', maxCount: 1 },
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
