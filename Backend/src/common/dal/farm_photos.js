const models = require('cccommon/models/internaldb');
const {frontend_host, app_url} = require('cccommon/config');
/**
 * @description Saves a farm photo to the database
 * @param {*} farmPhoto 
 * @returns 
 */
async function saveFarmPhoto(farmPhoto)
{
    try
    {
        const savedFarmPhoto = await models.FarmPhotos.create(farmPhoto);

        //remove "uploads/" from the path
        if(savedFarmPhoto.farm_photo_1)
        {
            savedFarmPhoto.farm_photo_1 = app_url() + savedFarmPhoto.farm_photo_1;
        }

        if(savedFarmPhoto.farm_photo_2)
        {
            savedFarmPhoto.farm_photo_2 = app_url() + savedFarmPhoto.farm_photo_2;
        }

        if(savedFarmPhoto.farm_photo_3)
        {
            savedFarmPhoto.farm_photo_3 = app_url() + savedFarmPhoto.farm_photo_3;
        }
        
        return savedFarmPhoto;
    }
    catch (error)
    {
        throw new Error(`Error saving farm photo: ${error.message}`);
    }
}

/**
 * @description Updates a farm photo in the database
 * @param {*} farmPhoto
 * @returns 
 */
async function updateFarmPhoto(farmPhoto)
{
    try
    {
        const updatedFarmPhoto = await models.FarmPhotos.update(farmPhoto, {
            where: {
                id_farm: farmPhoto.id_farm
            }
        });

        return updatedFarmPhoto;
    }
    catch (error)
    {
        throw new Error(`Error updating farm photo: ${error.message}`);
    }
}

async function getFarmPhoto(id_farm)
{
    try
    {
        const farmPhoto = await models.FarmPhotos.findOne({
            where: {
                id_farm: id_farm
            }
        });

        return farmPhoto;
    }
    catch (error)
    {
        throw new Error(`Error getting farm photo: ${error.message}`);
    }
}

module.exports = {
    saveFarmPhoto,
    updateFarmPhoto,
    getFarmPhoto
};