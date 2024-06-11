const makeOfferDal = require('cccommon/dal/make_offer');
const userDal = require('cccommon/dal/user');
const stateDal = require('cccommon/dal/states');
const countryDal = require('cccommon/dal/countries');
const lotDal = require('cccommon/dal/lots');
const lotFarm = require('cccommon/dal/farms');
const appErr = require('this_pkg/error');
const { frontend_host, app_url } = require('cccommon/config');

exports.handler = async (req, res) => {
  const id_buyer = Number(req.params.id_buyer);
  if (!id_buyer) {
    appErr.send(req, res, 'validation_error', 'Missing id_buyer');
    return;
  }
  
  try {
    let offers = await makeOfferDal.getOfferToBuyByIdBusinessman(id_buyer);
  
    if (!Array.isArray(offers)) {
      offers = [offers];
    }

    //print length of offers

    const processedOffers = [];

    for (let offer of offers) {
      const status_offer = offer.OfferStatus.id_offer_status

      if (status_offer === 1) {
        offer = offer.toJSON();
        offer.Lot.LotPhoto.lot_photo = offer.Lot.LotPhoto.lot_photo ? app_url() + offer.Lot.LotPhoto.lot_photo : null;
        offer.Seller.user_profile_photo = offer.Seller.user_profile_photo ? app_url() + offer.Seller.user_profile_photo : null;
        processedOffers.push(offer);
      }

    }


    res.status(200).json({
      message: 'Offers retrieved successfully',
      processedOffers
    });
  } catch (error) {
    appErr.handleRouteServerErr(req, res, error, 'Failed to retrieve offers');
  }
};
