const models = require('cccommon/models/internaldb');

async function getAllCoffeeProfiles()
{
    try
    {
        const coffeeProfiles = await models.CoffeeProfile.findAll();

        return coffeeProfiles;
    }
    catch (error)
    {
        throw new Error(`Error getting coffee profiles: ${error.message}`);
    }
}

module.exports = {
    getAllCoffeeProfiles
};