exports.getRoutes = () => {
	const { trimInputMiddleware } = require('cccommon/utils');
	const tokenAuth = require('this_pkg/auth/token');
	const path = '/get_states/:id_country';
	return [
		{
			method: 'get',
			path: path,
			tokenAuthWrapper: tokenAuth.DISABLED, //TODO: cambiar a REQUIRED
			handler: require('./get').handler,
			customWrappers: [
				trimInputMiddleware(),
			]
		}
	]


}