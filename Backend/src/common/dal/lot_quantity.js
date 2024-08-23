const models = require('../models/internaldb');

async function createLotQuantity(data) {
  try {
    const newLotQuantity = models.LotQuantity.build(data);
    const savedLotQuantity = await newLotQuantity.save();
    return savedLotQuantity;
  } catch (error) {
    throw new Error(`Error creating lot quantity: ${error.message}`);
  }
}

async function updateLotQuantity(id_lot, data) {
  try {
    const updatedRows = await models.LotQuantity.update(data, { where: { id_lot: id_lot } });
    if (updatedRows[0] === 0) {
      return null;
    }

    const updatedLotQuantity = await models.LotQuantity.findOne({ where: { id_lot: id_lot } });
    return updatedLotQuantity;

  } catch (error) {
    throw new Error(`Error updating lot quantity: ${error.message}`);
  }
}


async function getLotQuantityById(id_lot_quantity) {
  try {
    const lotQuantity = await models.LotQuantity.findOne({ where: { id_lot_quantity: id_lot_quantity } });
    return lotQuantity;
  } catch (error) {
    throw new Error(`Error fetching lot quantity by ID: ${error.message}`);
  }
}

async function getLotQuantityByIdLot(id_lot) {
  try {

    const lotQuantity = await models.LotQuantity.findOne({ where: { id_lot: id_lot } });
    
    return lotQuantity;
  
  } catch (error) {
   
    throw new Error(`Error getting lot quantity: ${error.message}`);
  
  }
}

async function updateLotQuantityByIdLot(id_lot, newTotalQuantity) {
  
  try {
  
    await models.LotQuantity.update({ total_quantity: newTotalQuantity }, { where: { id_lot: id_lot } });
  
  } catch (error) {
  
    throw new Error(`Error updating lot quantity: ${error.message}`);
  
  }
}

module.exports = {
  createLotQuantity,
  updateLotQuantity,
  getLotQuantityById,
  getLotQuantityByIdLot,
  updateLotQuantityByIdLot
};
