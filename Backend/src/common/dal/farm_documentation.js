/*const models = require('../models/internaldb');

async function createFarmDocumentation(data) {
  try {
    const newFarmDocumentation = models.FarmDocumentation.build(data);
    const savedFarmDocumentation = await newFarmDocumentation.save();
    return savedFarmDocumentation;
  } catch (error) {
    throw new Error(`Error creating Farm documentation: ${error.message}`);
  }
}

async function updateFarmDocumentation(id_user, data) {
  try {

    const updatedFarmDocumentation = await models.FarmDocumentation.update(
              data, 
              { where: 
                { id_user: id_user } 
              });
              
    return updatedFarmDocumentation;
  } catch (error) {
    throw new Error(`Error updating Farm documentation: ${error.message}`);
  }
}

async function getFarmDocumentationById(id_farm) {
  try {
    const FarmDocumentation = await models.FarmDocumentation.findOne({
      where: {
        id_farm: id_farm
      }
    });
    return FarmDocumentation;
  } catch (error) {
    throw new Error(`Error fetching Farm documentation by ID: ${error.message}`);
  }
}

async function getFarmDocumentationByUserId(id_user) {
  try {
    const FarmDocumentation = await models.FarmDocumentation.findOne({
      where: {
        id_user: id_user
      }
    });
    return FarmDocumentation;
  } catch (error) {
    throw new Error(`Error fetching Farm documentation by User ID: ${error.message}`);
  }
}

async function farmHasDocumentationById(id_farm) {
  try {
    const FarmDocumentation = await models.FarmDocumentation.findOne({
      where: {
        id_farm: id_farm
      }
    });
    return !!FarmDocumentation;

  } catch (error) {
    throw new Error(`Error fetching Farm documentation by ID: ${error.message}`);
  }
}

module.exports = {
  createFarmDocumentation,
  updateFarmDocumentation,
  getFarmDocumentationById,
  farmHasDocumentationById,
  getFarmDocumentationByUserId
};*/
