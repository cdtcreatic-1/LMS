exports.getRoutes = () => {
  const { trimInputMiddleware } = require("cccommon/utils");
  const tokenAuth = require("this_pkg/auth/token");
  const path = "/consume_businessman_profile_data_microservice";
  return [
    {
      method: "post",
      path: path,
      tokenAuthWrapper: tokenAuth.REQUIRED,
      handler: require("./post").handler,
      customWrappers: [trimInputMiddleware()],
    }, , {
      method: 'get',
      path: path,
      tokenAuthWrapper: tokenAuth.DISABLED,
      handler: require('./get').handler,
      customWrappers: [
        trimInputMiddleware(),
      ]
    }
  ];
};
