const models = require('../models/internaldb');

async function createOfferToBuy(data) {
  try {
    const newMakeOffer = models.MakeOffer.build(data);
    const savedMakeOffer = await newMakeOffer.save();
    return savedMakeOffer;
  } catch (error) {
    throw new Error(`Error creating offer: ${error.message}`);
  }
}

async function updateOfferToBuy(id_seller, id_buyer, id_lot, id_offer_status) {

  try {

    //get the offer with the id_seller, id_buyer, id_lot
    const offer = await models.MakeOffer.findAll({ where: { id_seller: id_seller, id_buyer: id_buyer, id_lot: id_lot } });
    let updatedOffer;
    for (let i = 0; i < offer.length; i++) {
      const offerJson = offer[i].toJSON();
      //upate the offer status with offerJson.id_make_offer
      if (offerJson.id_offer_status !== 2) {
        updatedOffer = await models.MakeOffer.update({ id_offer_status: id_offer_status }, {
          where: { id_make_offer: offerJson.id_make_offer },
          returning: true,
        });
        break;
      }
    }

    return updatedOffer;
  } catch (error) {
    throw new Error(`Error updating offer: ${error.message}`);
  }
}

async function getOfferToBuyByIdBusinessman(id_buyer) {
  try {
    const makeOffer = await models.MakeOffer.findAll(
      {
        where: { id_buyer: id_buyer },
        attributes: ['id_make_offer', 'id_buyer', 'offer_created_at', 'offer_updated_at', 'offer_deleted_at'],
        include: [
          {
            model: models.Lots,
            attributes: ['id_lot', 'lot_number', 'id_farm', 'lot_created_at', 'lot_updated_at', 'lot_deleted_at'],
            include: [
              { model: models.CoffeeVariations },
              { model: models.CoffeeProfile },
              { model: models.RoastingType },
              { model: models.LotPhoto },
              { model: models.ScoreLots },
              { model: models.LotSummary },
              { model: models.LotQuantity },
            ],
          },
          {
            model: models.User, as: 'Seller',
            attributes: ['id_user', 'user_name', 'user_profile_photo'],

          },
          // { model: models.User, as: 'buyer' },
          { model: models.OfferStatus },
        ],
      }
    );


    const uniqueOffers = Object.values(makeOffer.reduce((acc, offer) => {
      
      acc[offer.dataValues.id_make_offer] = offer;
      return acc;
  }, {}));

    //Remove the repeated offers with the same id_make_offer

    return uniqueOffers;
  } catch (error) {
    throw new Error(`Error fetching offer by id: ${error.message}`);
  }
}

async function getOfferToBuyByIdBuyerIdLot(id_buyer, id_lot) {

  const makeOffer = await models.MakeOffer.findAll({
    where: { id_buyer: id_buyer, id_lot: id_lot },
  })

  return makeOffer;
}

async function getOfferStatusData(id_buyer) {
  try {
    const makeOffer = await models.MakeOffer.findOne({ where: { id_buyer: id_buyer } });
    return makeOffer;
  } catch (error) {
    throw new Error(`Error fetching offer by id: ${error.message}`);
  }
}

module.exports = {
  createOfferToBuy,
  updateOfferToBuy,
  getOfferToBuyByIdBusinessman,
  getOfferStatusData,
  getOfferToBuyByIdBuyerIdLot,
};
