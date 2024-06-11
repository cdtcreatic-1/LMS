const models = require('../models/internaldb');

async function createLotCertification(data) {
  try {
    const newCertification = models.LotCertifications.build(data);
    const savedCertification = await newCertification.save();
    return savedCertification;
  } catch (err) {
    throw new Error(`Error creating lot certification: ${err.message}`);
  }
}

async function updateLotCertification(id_lot, data) {
  try {
    const updatedRows = await models.LotCertifications.update(data, { where: { id_lot: id_lot } });
    
    if (updatedRows[0] === 0) {
      return null;
    }

    const updatedCertification = await models.LotCertifications.findOne({ where: { id_lot: id_lot } });
    return updatedCertification ? updatedCertification.toJSON() : null;
    
  } catch (error) {
    throw new Error(`Error updating lot certification: ${error.message}`);
  }
}


async function getLotCertificationById(id_lot) {
  try {
    const certification = await models.LotCertifications.findOne({
      where: {
        id_lot: id_lot
      }
    });
    return certification;
  } catch (err) {
    throw new Error(`Error fetching lot certification: ${err.message}`);
  }
}

module.exports = {
    createLotCertification,
    updateLotCertification,
    getLotCertificationById
};
