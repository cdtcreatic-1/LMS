const tokenAuth = require('this_pkg/auth/token');

exports.getRoutes = () => {
  const { trimInputMiddleware } = require('cccommon/utils');
  const path = '/notification_for_businessman';
  const pathBusinessmanID = '/notification_for_businessman/:id_buyer';

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
      path: pathBusinessmanID,
      tokenAuthWrapper: tokenAuth.REQUIRED,
      handler: require('./get').handler,
      customWrappers: [
        trimInputMiddleware(),
      ]
    }
  ];
};
