exports.getRoutes = () => {
  const { trimInputMiddleware } = require('cccommon/utils');
  const tokenAuth = require('this_pkg/auth/token');
  const path = '/businesman_coffee_interested';
  const pathWithId = '/businesman_coffee_interested/:id_user';
  return [
    {
      method: 'post',
      path: path,
      tokenAuthWrapper: tokenAuth.REQUIRED,
      handler: require('./post').handler,
      customWrappers: [
        trimInputMiddleware(),
      ],
    },
    {
      method: 'get',
      path: pathWithId,
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
      ]
    },
  ];
};
