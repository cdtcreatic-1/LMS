const countriesDal = require('cccommon/dal/countries')
const appErr = require('this_pkg/error');


exports.handler = async(req, res) => {
	try {

		const countriesFound = await countriesDal.getCountries();
		res.status(200).json(countriesFound);

	} catch(error) {
		appErr.handleRouteServerErr(req, res, error, 'failed to get countries')
	}

}; 