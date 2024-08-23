const FarmDocumentationDal = require('cccommon/dal/farm_documentation');
const appErr = require('this_pkg/error');
const {frontend_host, app_url} = require('cccommon/config');

exports.handler = async (req, res) => {
  const id_user = Number(req.params.id_user);

  if (!Number.isInteger(id_user) || id_user <= 0) {
    appErr.send(req, res, 'validation_error', 'Invalid id_user, must be a number and positive');
    return;
  }
  try {
    const FarmDocumentation = await FarmDocumentationDal.getFarmDocumentationByUserId(id_user);

    if (!FarmDocumentation) {
      appErr.send(req, res, 'documentation_not_found', 'Farm documentation not found');
      return;
    }

    FarmDocumentation.dataValues.farm_documentation_id_document = FarmDocumentation.dataValues.farm_documentation_id_document;
    FarmDocumentation.dataValues.farm_documentation_rut = FarmDocumentation.dataValues.farm_documentation_rut;
    FarmDocumentation.dataValues.farm_documentation_chamber_commerce = FarmDocumentation.dataValues.farm_documentation_chamber_commerce;

    res.status(200).send(FarmDocumentation);
  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'Failed to get Farm documentation');
  }
};
