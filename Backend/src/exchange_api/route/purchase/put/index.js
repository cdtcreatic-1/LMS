const purchaseDal = require('cccommon/dal/purchase')
const appErr = require('this_pkg/error');


exports.handler = async (req, res) => {
  let purchaseData;
  const successStatus = 201;

  const { id_seller, id_buyer, id_lot, purchase_quantity, id_shipping_option, shipping_address, additional_notes } = req.body;
  const valErrs = [];

  const id_purchase_status = 1;
  req.body.id_purchase_status = id_purchase_status;
  
  const requiredFields = ['id_seller', 'id_buyer', 'id_lot', 'purchase_quantity', 'id_shipping_option', 'id_purchase_status', 'shipping_address', 'additional_notes'];

  requiredFields.forEach(field => {
    if (!req.body[field]) {
      valErrs.push({ [field]: 'missing' });
    }
  });

  if (valErrs.length) {
    appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
    return;
  }

  const purchase_at = new Date();

  try {
    purchaseData = await purchaseDal.updatePurchase({ id_seller, id_buyer, id_lot, purchase_quantity, id_shipping_option, id_purchase_status, shipping_address, additional_notes, purchase_at });

  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'failed to create purchase');
  }

  res.status(successStatus).send({
    message: 'purchase updated successfully',
    purchaseData: purchaseData
  });
};