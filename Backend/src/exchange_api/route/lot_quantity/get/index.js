const lotQuantityDal = require('cccommon/dal/lot_quantity');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
  const id_lot = Number(req.params.id_lot);
  if(!id_lot){
    appErr.send(req, res, 'validation_error', 'Missing id_lot');
    return;
  }
  try {
    const lotQuantity = await lotQuantityDal.getLotQuantityByIdLot(id_lot);

    if (!lotQuantity) {
      appErr.send(req, res, 'not_found', 'Lot quantity not found');
      return;
    }

    res.status(200).send(lotQuantity);
  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'Failed to get lot quantity');
  }
};