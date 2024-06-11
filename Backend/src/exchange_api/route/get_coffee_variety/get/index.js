const coffeVarietyDal = require('cccommon/dal/coffee_variations')
const appErr = require('this_pkg/error');


exports.handler = async(req, res) => {
	try {
		const coffeeVariety = await coffeVarietyDal.getAllCoffeeVariations();
		res.status(200).json(coffeeVariety);

	} catch(error) {
		appErr.handleRouteServerErr(req, res, error, 'failed to get coffe variety')
	}

}; 