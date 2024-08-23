const associationDal = require('cccommon/dal/associations')
const appErr = require('this_pkg/error');


exports.handler = async(req, res) => {
	try {
		const associations = await associationDal.getAllAssociations();
		res.status(200).json(associations);

	} catch(error) {
		appErr.handleRouteServerErr(req, res, error, 'failed to get all associations')
	}

}; 