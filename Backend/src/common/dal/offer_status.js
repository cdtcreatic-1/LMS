const models = require('../models/internaldb');

async function getAllOfferStatuses() {
  try {
    const statuses = await models.OfferStatus.findAll();
    return statuses;
  } catch (error) {
    throw new Error(`Error fetching all offer statuses: ${error.message}`);
  }
}

async function getOfferStatusById(id_offer_status) {
  try {
    const status = await models.OfferStatus.findOne({ 
        where: { 
            id_offer_status: id_offer_status 
        }, 
        
    });
    return status;
  } catch (error) {
    throw new Error(`Error fetching offer status by id: ${error.message}`);
  }
}

async function getOfferStatusNameById(id_offer_status) {
    try {
      const status = await models.OfferStatus.findOne({ 
        where: { 
            id_offer_status: id_offer_status 
        },
        attributes: ['offer_status_name']
    });
      return status;
    } catch (error) {
      throw new Error(`Error fetching offer status by id: ${error.message}`);
    }
  }

module.exports = {
    getAllOfferStatuses,
    getOfferStatusById,
    getOfferStatusNameById
};
