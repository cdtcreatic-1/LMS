const coffeProfDal = require('cccommon/dal/coffee_profile')
const appErr = require('this_pkg/error');


exports.handler = async(req, res) => {

	
	try {

		const coffeProfile = await coffeProfDal.getAllCoffeeProfiles();

		res.status(200).json(coffeProfile);

	} catch(error) {
		appErr.handleRouteServerErr(req, res, error, 'failed to get coffee profile')
	}

}; 