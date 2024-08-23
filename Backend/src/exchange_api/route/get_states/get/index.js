const statesDal = require('cccommon/dal/states')
const countriesDal = require('cccommon/dal/countries')

const appErr = require('this_pkg/error')


exports.handler = async(req, res) => {

	const successStatus = 200;
	const id_country = Number(req.params.id_country);
	let states;     

	if(!id_country){
		appErr.send(req, res, 'validation_error', 'Missing id_country');
		return;
	}

	const validationErrors = [];

	if(!id_country) {
		validationErrors.push({id_country: 'missing'});
	}

	if(validationErrors.length){
		appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(validationErrors));
	}

	try {
		//Ask if the country exist
		const countryExist = await countriesDal.getCountriesByIdCountry(id_country);

		if(!countryExist)
		{
			appErr.send(req, res, 'not_found', 'Country not found');
		}

		states = await statesDal.getStatesWithIdCountry(id_country);

		return res.status(successStatus).send({
			message: 'states getting successfully',
			states: states
		});

	} catch (err) {
		appErr.handleRouteServerErr(req, res, err, 'failed to get states with id_country')
	}
	
}