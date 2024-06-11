const models = require('cccommon/models/internaldb');


async function getAllClimates() {

    try {

        const climates = await models.Climates.findAll();

        return climates;
    } catch (error) {
        throw new Error(`Error getting climates: ${error.message}`);
    }
}

module.exports = {
    getAllClimates
};