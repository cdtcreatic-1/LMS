const models = require('../models/internaldb');

async function createLotPhoto(data) {
    try {
        const newLotPhoto = models.LotPhoto.build(data);
        const savedLotPhoto = await newLotPhoto.save();
        return savedLotPhoto;
    } catch (error) {
        throw new Error(`Error adding lot photo: ${error.message}`);
    }
}

async function getLotPhotoByIdLot(id_lot) {
    try {
        const lotPhoto = await models.LotPhoto.findOne({ where: { id_lot } });
        return lotPhoto;
    } catch (error) {
        throw new Error(`Error getting lot photo: ${error.message}`);
    }
}

async function updateLotPhoto(id_lot, data) {
    try {
        const updatedLotPhoto = await models.LotPhoto.update(data, { where: { id_lot } });
        return updatedLotPhoto;
    } catch (error) {
        throw new Error(`Error updating lot photo: ${error.message}`);
    }
}

module.exports = {
  createLotPhoto,
  getLotPhotoByIdLot,
  updateLotPhoto,
};
