const models = require('../models/internaldb');

async function createLotSummary(data) {
  try {
    const newLotSummary = models.LotSummary.build(data);
    const savedLotSummary = await newLotSummary.save();
    return savedLotSummary;
  } catch (error) {
    throw new Error(`Error creating lot summary: ${error.message}`);
  }
}

async function updateLotSummary(id_lot, data) {
  try {
    const updatedRows = await models.LotSummary.update(data, { where: { id_lot: id_lot } });
    if (updatedRows[0] === 0) {
      return null;
    }
    
    const updatedLotSummary = await models.LotSummary.findOne({ where: { id_lot: id_lot } });
    return updatedLotSummary ? updatedLotSummary.toJSON() : null;
    
  } catch (error) {
    throw new Error(`Error updating lot summary: ${error.message}`);
  }
}


async function getLotSummaryById(id_lot) {
    try {
      const lotSummaryData = await models.LotSummary.findOne({ where: { id_lot: id_lot } });
      return lotSummaryData;
    } catch (error) {
      throw new Error(`Error fetching lot summary: ${error.message}`);
    }
  }

module.exports = {
  createLotSummary,
  updateLotSummary,
  getLotSummaryById,
};