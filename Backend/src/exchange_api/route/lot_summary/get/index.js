const lotSummaryDal = require('cccommon/dal/lot_summary');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
  const id_lot = Number(req.params.id_lot);

  if(!id_lot){
    appErr.send(req, res, 'validation_error', 'Missing id_lot');
    return;
  }

  try {
    const lotSummaryData = await lotSummaryDal.getLotSummaryById(id_lot);

    if (!lotSummaryData) {
      appErr.send(req, res, 'not_found', 'Lot summary not found');
      return;
    }

    res.status(200).send({
      message: 'Lot summary retrieved successfully',
      lot_summary: lotSummaryData
    });

  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'Failed to get lot summary');
  }
};
