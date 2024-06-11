const models = require('cccommon/models/internaldb');


async function getStateWithIdState(id_state) {

    try {

        const state = await models.States.findAll({
            where: { id_state: id_state }
        });

        return state;
    } catch (error) {
        throw new Error(`Error getting state with this id_state: ${error.message}`);
    }
}

async function getStatesWithIdCountry(id_country) {

    try {

        const states = await models.States.findAll({
            where: { id_country: id_country }
        });

        return states;
    } catch (error) {
        throw new Error(`Error getting states with this id_country: ${error.message}`);
    }
}

async function getCountryWithIdState(id_state) {

    try {

        const states = await models.States.findAll({
            where: { id_state: id_state }
        });

        return states;
    } catch (error) {
        throw new Error(`Error getting states with this id_country: ${error.message}`);
    }
}

module.exports = {
	getStateWithIdState,
	getStatesWithIdCountry,
    getCountryWithIdState
};