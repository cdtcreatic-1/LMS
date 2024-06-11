exports.getRoutes = () => {
	const { trimInputMiddleware } = require('cccommon/utils');
	const tokenAuth = require('this_pkg/auth/token');
	const path = '/get_id_village_by_coordinates'
	return [
		{
			method: 'post',
			path: path,
			tokenAuthWrapper: tokenAuth.REQUIRED,
			handler: require('./post').handler,
			customWrappers: [
				trimInputMiddleware(),
			]
		}
	];

};