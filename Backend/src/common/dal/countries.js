const models = require('cccommon/models/internaldb');


async function getCountries() {
	try {
		const countries = await models.Countries.findAll();

		return countries

	} catch(error) {
		throw new Error(`Error getting countries: ${error.message}`);
	}
}


async function getCountriesByIdCountry(id_country) {

	try {
		const country = await models.Countries.findAll({
			where: {id_country: id_country}
		});

		return country;

	} catch(error) {
		throw new Error(`Error getting county with this id_country: ${error.error}`)
	}
}

module.exports = {
	getCountries,
	getCountriesByIdCountry
}