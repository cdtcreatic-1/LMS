const makeOfferDal = require('cccommon/dal/make_offer');
const lotDal = require('cccommon/dal/lots');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
  const successStatus = 201;
  const {
    id_seller,
    id_buyer,
    id_lot,
    id_offer_status,
  } = req.body;

  const valErrs = [];

  const requiredFields = ['id_seller', 'id_buyer', 'id_lot', 'id_offer_status'];

  requiredFields.forEach(field => {
    if (!req.body[field]) {
      valErrs.push({ [field]: 'missing' });
    }
  });

  if (valErrs.length) {
    appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
    return;
  }

  try{
    //ask if the lot belongs to the seller
    const user = await lotDal.findUserIdByIdLot(id_lot);
    if (user !== id_seller) {
      appErr.send(req, res, 'bad_request', 'The lot does not belong to the seller');
      return;
    }

  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'Failed to find lot');
  }
  
  try {
    const askOffer = await makeOfferDal.getOfferToBuyByIdBuyerIdLot(id_buyer, id_lot);

    if (askOffer.length > 2) {
      appErr.send(req, res, 'bad_request', 'The buyer already made three offers for this lot');
      return;
    }

    const offer = await makeOfferDal.createOfferToBuy({id_seller, id_buyer, id_lot, id_offer_status});
    
    res.status(successStatus).send(offer);
  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'Failed to create offer');
  }
};
