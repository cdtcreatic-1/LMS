exports.getRoutes = () => {
  const { trimInputMiddleware } = require('cccommon/utils');
  const tokenAuth = require('this_pkg/auth/token');
  const path = '/farms_additional_info';
  const pathPut = '/farms_additional_info/:id_farm';
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
      path: pathPut,
      tokenAuthWrapper: tokenAuth.REQUIRED,
      handler: require('./put').handler,
      customWrappers: [
        trimInputMiddleware(),
      ]
    },
    {
      method: 'get',
      path: pathPut,
      tokenAuthWrapper: tokenAuth.REQUIRED,
      handler: require('./get').handler,
      customWrappers: [
        trimInputMiddleware(),
      ]
    }
  ];
};
