const models = require('cccommon/models/internaldb');

async function getAllCoffeeVariations()
{
    try
    {
        const coffeeVariations = await models.CoffeeVariations.findAll();

        return coffeeVariations;
    }
    catch (error)
    {
        throw new Error(`Error getting coffee variations: ${error.message}`);
    }
}

module.exports = {
    getAllCoffeeVariations
};
