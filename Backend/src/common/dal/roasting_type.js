const models = require('cccommon/models/internaldb');


async function getAllRoastingTypes(){

    try
    {
        const roastingTypes = await models.RoastingType.findAll();

        return roastingTypes;
    }
    catch (error)
    {
        throw new Error(`Error getting roasting types: ${error.message}`);
    }
}

module.exports = {
    getAllRoastingTypes
};
