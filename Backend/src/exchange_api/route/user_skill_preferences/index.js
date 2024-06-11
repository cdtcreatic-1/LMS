exports.getRoutes = () => {
    const { trimInputMiddleware } = require('cccommon/utils');
    const tokenAuth = require('this_pkg/auth/token');
    const path = '/user_skill_preferences';
    const pathPostArr = '/user_skill_preferences_arr';
    const pathGet = '/user_skill_preferences/:id_user';

    return [
        {
            method: 'post',
            path: path,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./post').handler,
            customWrappers: [
                trimInputMiddleware()
            ]
        },
        {
            method: 'post',
            path: pathPostArr,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./post_arr').handler,
            customWrappers: [
                trimInputMiddleware()
            ]
        },
        {
            method: 'get',
            path: pathGet,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./get').handler,
            customWrappers: [
                trimInputMiddleware()
            ]
        },
        {
            method: 'delete',
            path: pathGet,
            tokenAuthWrapper: tokenAuth.REQUIRED,
            handler: require('./delete').handler,
            customWrappers: [
                trimInputMiddleware()
            ]
        }
    ];
};
