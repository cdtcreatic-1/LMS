/*const models = require('../models/internaldb');

async function createFarmAdditionalInfo(data) {
  try {
    
    const newInfo = models.FarmAdditionalInfo.build(data);
    const savedInfo = await newInfo.save();
    return savedInfo;
  } catch (error) {
    throw new Error(`Error creating farm additional info: ${error.message}`);
  }
}

async function updateFarmAdditionalInfo(id_farm, data) {
  try {
    const [updatedRows] = await models.FarmAdditionalInfo.update(data, { where: { id_farm: id_farm } });
    if (updatedRows === 0) {
      return null;
    }
    const updatedInfo = await models.FarmAdditionalInfo.findOne({ where: { id_farm: id_farm } });
    return updatedInfo;
  } catch (error) {
    throw new Error(`Error updating farm additional info: ${error.message}`);
  }
}

async function getFarmAdditionalInfoById(id_farm) {
  try {
    const info = await models.FarmAdditionalInfo.findOne({ where: { id_farm: id_farm } });
    return info;
  } catch (error) {
    throw new Error(`Error fetching farm additional info: ${error.message}`);
  }
}

module.exports = {
    createFarmAdditionalInfo,
    updateFarmAdditionalInfo,
    getFarmAdditionalInfoById
};*/
