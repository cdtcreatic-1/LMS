exports.getRoutes = () => {
	const { trimInputMiddleware } = require('cccommon/utils');
	const tokenAuth = require('this_pkg/auth/token');
	const path = '/get_coordinates_by_id_village'
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