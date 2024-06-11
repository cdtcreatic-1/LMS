exports.getRoutes = () => {
  const { trimInputMiddleware } = require('cccommon/utils');
  const tokenAuth = require('this_pkg/auth/token');
  const path = '/lot_summary';
  const pathWithID = '/lot_summary/:id_lot';

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
      path: pathWithID,
      tokenAuthWrapper: tokenAuth.REQUIRED,
      handler: require('./get').handler,
      customWrappers: [
        trimInputMiddleware(),
      ]
    }
  ];
};
