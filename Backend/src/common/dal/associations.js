const models = require('cccommon/models/internaldb');

async function getAllAssociations(){

    try
    {
        const associations = await models.Associations.findAll();

        return associations;
    }
    catch (error)
    {
        throw new Error(`Error getting associations: ${error.message}`);
    }
}

module.exports = {
    getAllAssociations
};