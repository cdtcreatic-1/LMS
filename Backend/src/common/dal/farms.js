const models = require('cccommon/models/internaldb');


// Fill in the fields for the new user in Farms using models.Farms.build
async function createFarm(farmData) {
    try {
        const farm = await models.Farms.build(farmData);
        await farm.save();
        return farm;
    } catch (err) {
        console.log(err);
        throw new Error(`Error creating farm: ${err.message}`);
    };
};

// Update the fileds for the user in Farms using models.Farms.update using id_farm
async function updateFarm(farmData) {
    try {
        const result = await models.Farms.update(farmData, { where: { id_farm: farmData.id_farm } });
        if (result[0] === 0) {
            return null;
        }
        const updatedFarm = await models.Farms.findOne({ where: { id_farm: farmData.id_farm } });
        return updatedFarm;
    } catch (err) {
        throw new Error(`Error updating farm: ${err.message}`);
    }
}
// Delete farm by id_farm

async function deleteFarmById(id_farm){
    try {
        await models.FarmPhotos.destroy({
            where: {
                id_farm: id_farm
            }
        });
        await models.Lots.destroy({
            where: {
                id_farm: id_farm
            }
        });
        await models.Farms.destroy({
            where: {
                id_farm: id_farm
            }
        });
        
    } catch (err) {
        throw new Error(`Error deleting farm and related data: ${err.message}`);
    }
}


// Get farms by id_user
async function getFarmsByIdUser(id_user) {

    try {
        const farms = await models.Farms.findAll({
            where: {
                id_user: id_user,
                farm_status: true
            },
            attributes: ['id_farm', 'farm_name', 'farm_number_lots'],
            include: [
                {
                    model: models.Villages,
                    attributes: ['village_name'],
                    include: [
                        {
                            model: models.Cities,
                            attributes: ['city_name'],
                            include: [
                                {
                                    model: models.States,
                                    attributes: ['state_name']
                                }
                            ]
                        }
                    ]
                }
            ]
        });      

        return farms;

    } catch (err) {
        console.log(err);
        throw new Error(`Error getting farms by id_user: ${err.message}`);
    }
};

// Get farms by id_farm
async function getFarmsByIdFarm(id_farm) {

    try {
        const farms = await models.Farms.findAll({
            where: {
                id_farm: id_farm
            },
        });
        return farms;
        
    } catch (err) {
        throw new Error(`Error getting farms by id_farm: ${err.message}`);
    }
};

// Save sc and taster certificates
async function saveScAndTasterCertificates(id_farm, scCertificate, tasterCertificate, contact_qgrader) {

    try {
        const farm3 = await models.LotCertifications.build(
            {
                id_farm: id_farm,
                product_sc_certificate: scCertificate,
                product_taster_certificate: tasterCertificate,
                contact_qgrader: contact_qgrader
            }
        );

        await farm3.save();

        return farm3;

    } catch (err) {
        throw new Error(`Error saving sc and taster certificates: ${err.message}`);
    }
}

// Update sc and taster certificates
async function updateScAndTasterCertificates(id_farm, scCertificate, tasterCertificate, contact_qgrader) {

    try {
        const updatedFarm3 = await models.LotCertifications.update(
            {
                product_sc_certificate: scCertificate,
                product_taster_certificate: tasterCertificate,
                contact_qgrader: contact_qgrader
            },
            {
                where: {
                    id_farm: id_farm
                }
            }
        );

        return updatedFarm3;

    } catch (err) {
        throw new Error(`Error updating sc and taster certificates: ${err.message}`);
    }
}

async function getScAndTasterCertificatesByIdFarm(id_farm) {

    try {
        const farm3 = await models.LotCertifications.findAll({
            where: {
                id_farm: id_farm
            },
        });

        return farm3;

    } catch (err) {

        throw new Error(`Error getting sc and taster certificates by id_farm: ${err.message}`);
    }
}


async function deleteAllFarms() {
    try {
        await models.LotCertifications.destroy({
            where: {},
        });

        await models.Farms.destroy({
            where: {},
        });

        console.log('All farms deleted');

    } catch (err) {
        throw new Error(`Error deleting all farms: ${err.message}`);
    }
}


async function getAllFarmers() {
    try {
        const farmers = await models.Farms.findAll();

        return farmers;

    } catch (err) {
        throw new Error(`Error getting all farmers: ${err.message}`);

    }

}

module.exports = {
    createFarm,
    updateFarm,
    deleteFarmById,
    getFarmsByIdUser,
    getFarmsByIdFarm,
    saveScAndTasterCertificates,
    updateScAndTasterCertificates,
    getScAndTasterCertificatesByIdFarm,
    deleteAllFarms,
    getAllFarmers
};
