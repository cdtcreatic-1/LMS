exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const path = '/get_climate_and_temperature';
    return [
        {
            method: 'post',
            path: path,
            tokenAuthWrapper: tokenAuth.REQUIRED, //TODO: Cambiar a REQUIRED
            handler: require('./post').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        }
    ];
};
