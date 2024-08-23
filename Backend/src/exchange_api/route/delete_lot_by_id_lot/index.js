exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const pathGet = '/delete_lot_by_id_lot/:id_lot';
    return [
        {
            method: 'delete',
            path: pathGet,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./delete').handler,
            customWrappers: [
                trimInputMiddleware(),
            ]
        }
    ];
};
