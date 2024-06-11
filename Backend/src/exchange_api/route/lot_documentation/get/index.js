const FarmDocumentationDal = require('cccommon/dal/farm_documentation');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
  const id_lot = Number(req.params.id_lot);
  if(!id_lot){
    appErr.send(req, res, 'validation_error', 'Missing id_lot');
    return;
  }
  try {
    const FarmDocumentation = await FarmDocumentationDal.getFarmDocumentationById(id_lot);

    if (!FarmDocumentation) {
      appErr.send(req, res, 'not_found', 'Farm documentation not found');
      return;
    }

    res.status(200).send(FarmDocumentation);
  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'Failed to get Farm documentation');
  }
};
