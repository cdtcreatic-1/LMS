const models = require('cccommon/models/internaldb');

async function getAllShippingOptions(){
    
        try
        {
            const shippingOptions = await models.ShippingOptions.findAll();
    
            return shippingOptions;
        }
        catch (error)
        {
            throw new Error(`Error getting shipping options: ${error.message}`);
        }
    }

module.exports = {
    getAllShippingOptions
};