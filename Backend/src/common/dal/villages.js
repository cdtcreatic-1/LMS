const models = require('cccommon/models/internaldb');


async function getVillagesWithIdCity(id_city) {

    try {

        const villages = await models.Villages.findAll({
            where: { id_city: id_city }
        });

        return villages;
    } catch (error) {
        throw new Error(`Error getting villages with this id_city: ${error.message}`);
    }
}

async function getVillagesWithIdVillage(id_village) {

    try {

        const villages = await models.Villages.findAll({
            where: { id_village: id_village }
        });

        return villages;
    } catch (error) {
        throw new Error(`Error getting villages with this id_village: ${error.message}`);
    }
}

async function  getVillageCityStateCountry(id_village) {
    try {
        const village = await models.Villages.findOne({
            where: { id_village },
            include: [{
                model: models.Cities,
                required: true,
                include: [{
                    model: models.States,
                    required: true,
                    include: [{
                        model: models.Countries,
                        required: true
                    }]
                }]
            }]
        });
        
        if (!village) {
            throw new Error('No se encontró el village con el id proporcionado');
        }
        
        return {
            village_name: village.village_name,
            city_name: village.City.city_name,
            state_name: village.City.State.state_name,
            country_name: village.City.State.Country.country_name,
        };
        
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function createVillage(villageData) {
    try {
        const newVillage = models.Villages.build(villageData);
        const savedVillage = await newVillage.save();
        return savedVillage;
    } catch (error) {
        throw new Error(`Error creating village: ${error.message}`);
    }
};

async function updateVillage(id_village, villageData) {
    try {
        const village = await models.Village.findByPk(id_village);
        if (!village) {
            throw new Error('Village not found');
        }
        await village.update(villageData);
        return village.toJSON();
    } catch (error) {
        throw new Error(`Error updating village: ${error.message}`);
    }
};

module.exports = {
    getVillagesWithIdCity,
    getVillagesWithIdVillage,
    getVillageCityStateCountry,
    createVillage
};