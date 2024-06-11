const lotSummaryDal = require('cccommon/dal/lot_summary');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {

  const {id_lot, germination_summary, sown_summary, harvest_summary, drying_summary, roasting_summary, packaging_summary } = req.body;

  const valErrs = [];

  let requiredFields = ['id_lot', 'germination_summary', 'sown_summary', 'harvest_summary', 'drying_summary', 'roasting_summary', 'packaging_summary'];

  requiredFields.forEach(field => {
    if (!req.body[field]) {
      valErrs.push({ [field]: 'missing' });
    }
  });

  const regex = /[0-9,.ñáéíóúÁÉÍÓÚ]+/;

  requiredFields.forEach(field => {
    if(!regex.test(req.body[field])){
      valErrs.push(`${field} contiene caracteres no permitidos`);
    }
  })

  if (valErrs.length) {
    appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
    return;
  }

  try {
    const updatedRows = await lotSummaryDal.updateLotSummary(id_lot, {
      germination_summary,
      sown_summary,
      harvest_summary,
      drying_summary,
      roasting_summary,
      packaging_summary,
    });

    if (updatedRows[0] === 0) {
      appErr.send(req, res, 'not_found', 'Lot summary not found');
      return;
    }

    res.status(200).send({ 
      message: 'Lot summary updated successfully',
      Lot_Summary: updatedRows
    });
  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'Failed to update lot summary');
  }
};
