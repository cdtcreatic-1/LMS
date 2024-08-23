exports.getRoutes = () => {
	const { trimInputMiddleware } = require('cccommon/utils');
	const tokenAuth = require('this_pkg/auth/token');
	const path = '/get_users_paginated/:page';
	return [
		{
			method: 'get',
			path: path,
			tokenAuthWrapper: tokenAuth.REQUIRED, //TODO: cambiar a REQUIRED
			handler: require('./get').handler,
			customWrappers: [
				trimInputMiddleware(),
			]
		}
	]


}