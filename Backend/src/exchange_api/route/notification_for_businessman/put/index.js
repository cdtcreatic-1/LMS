const makeOfferDal = require('cccommon/dal/make_offer');
const cartDal = require('cccommon/dal/cart');
const lotDal = require('cccommon/dal/lots');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
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

  try {
    //ask if the lot belongs to the seller
    const user = await lotDal.findUserIdByIdLot(id_lot);

    if (user != id_seller) {
      appErr.send(req, res, 'bad_request', 'The lot does not belong to the seller');
      return;
    }

  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'Failed to find lot');
  }

  try {
    const updatedOffer = await makeOfferDal.updateOfferToBuy(id_seller, id_buyer, id_lot, id_offer_status);

    if (id_offer_status === 2) {
      const cartExist = await cartDal.getCartDataByIdUserIdLot(id_seller, id_buyer, id_lot);

      if (!cartExist[0]) {
        const cartData = await cartDal.saveCartData({ id_seller, id_buyer, id_lot });
      }
    }

    res.status(200).send({ message: 'Offer updated successfully' });
  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'Failed to update offer');
  }
};