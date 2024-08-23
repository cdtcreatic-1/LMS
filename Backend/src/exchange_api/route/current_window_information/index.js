exports.getRoutes = () => {
	const { trimInputMiddleware } = require('cccommon/utils');
	const tokenAuth = require('this_pkg/auth/token');
	const path = '/current_window_information/:id_user/:current_window_id/:id_farm'
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
	];

};