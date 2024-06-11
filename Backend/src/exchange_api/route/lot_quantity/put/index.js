const lotQuantityDal = require('cccommon/dal/lot_quantity');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {

  const {id_lot, total_quantity, samples_quantity, id_association, price_per_kilo } = req.body;

  const requiredFields = ['id_lot', 'total_quantity', 'samples_quantity', 'id_association', 'price_per_kilo'];
  requiredFields.forEach(field => {
      if (!req.body[field]) {
          valErrs.push({ [field]: 'missing' });
      }
  });
  
  try {
    const updatedRows = await lotQuantityDal.updateLotQuantity(id_lot, {
      total_quantity,
      samples_quantity,
      id_association,
      price_per_kilo
    });

    if (updatedRows[0] === 0) {
      appErr.send(req, res, 'not_found', 'Lot quantity not found');
      return;
    }

    res.status(200).send({ 
      message: 'Lot quantity updated successfully',
      lot_quantity: updatedRows
    });
  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'Failed to update lot quantity');
  }
};