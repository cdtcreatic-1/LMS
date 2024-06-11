const lotSummaryDal = require('cccommon/dal/lot_summary');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
  const successStatus = 201;
  const { id_lot, germination_summary, sown_summary, harvest_summary, drying_summary, roasting_summary, packaging_summary } = req.body;
  const valErrs = [];

  let requiredFields = [ 'germination_summary', 'sown_summary', 'harvest_summary', 'drying_summary', 'roasting_summary', 'packaging_summary'];

  requiredFields.forEach(field => {
    if (!req.body[field]) {
      valErrs.push({ [field]: 'missing' });
    }
  });

  const regex = /^[A-Za-z0-9áéíóúÁÉÍÓÚüÜñÑ.,\/\-_:;"'¿?!¡\s]{20,500}$/;

  requiredFields.forEach(field => {
    if (!regex.test(req.body[field])) {
      valErrs.push({ [field]: 'contiene caracteres no permitidos, debe ser mas de 20 el texto' });
    }
  })

  if (valErrs.length) {
    appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
    return;
  }

  try {
    const lotSummary = await lotSummaryDal.createLotSummary({
      id_lot,
      germination_summary,
      sown_summary,
      harvest_summary,
      drying_summary,
      roasting_summary,
      packaging_summary,
    });

    res.status(successStatus).send({
      message: 'Lot Summary created successfully',
      Lot_summary: lotSummary
    });
  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'Failed to create lot summary');
  }
};
