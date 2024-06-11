const coffeeRoastDal = require('cccommon/dal/roasting_type')
const appErr = require('this_pkg/error');


exports.handler = async(req, res) => {
	try {
		const coffeeRoasting = await coffeeRoastDal.getAllRoastingTypes();
		res.status(200).json(coffeeRoasting);

	} catch(error) {
		appErr.handleRouteServerErr(req, res, error, 'failed to get lots number')
	}

}; 