const FarmDocumentationDal = require('cccommon/dal/farm_documentation');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
  const successStatus = 201;
  const id_farm = req.body.id_farm;

  let farm_documentation_id_document;
  let farm_documentation_rut;
  let farm_documentation_chamber_commerce;

  if (req.files && req.files.farm_documentation_id_document) {
    farm_documentation_id_document = req.files.farm_documentation_id_document[0];
  }
  
  if (req.files && req.files.farm_documentation_rut) {
    farm_documentation_rut = req.files.farm_documentation_rut[0];
  }

  if (req.files && req.files.farm_documentation_chamber_commerce) {
    farm_documentation_chamber_commerce = req.files.farm_documentation_chamber_commerce[0];
  }

  const validationErrors = [];

  if (!id_farm) {
    validationErrors.push({ id_farm: 'missing' });
  }

  if (!farm_documentation_id_document) {
    validationErrors.push({ farm_documentation_id_document: 'missing' });
  }

  if (!farm_documentation_rut) {
    validationErrors.push({ farm_documentation_rut: 'missing' });
  }

  if (!farm_documentation_chamber_commerce) {
    validationErrors.push({ farm_documentation_chamber_commerce: 'missing' });
  }

  if (validationErrors.length) {
    appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(validationErrors));
    return;
  }

  try {

    const FarmDocumentationExists = await FarmDocumentationDal.getFarmDocumentationById(id_farm);
    if (FarmDocumentationExists) {
      appErr.send(req, res, 'farm_documentation_exist', 'Farm documentation already exists');
      return;
    }

    const FarmDocumentation = await FarmDocumentationDal.createFarmDocumentation({
      id_farm,
      farm_documentation_id_document: farm_documentation_id_document.path,
      farm_documentation_rut: farm_documentation_rut.path,
      farm_documentation_chamber_commerce: farm_documentation_chamber_commerce.path
    });

    res.status(successStatus).send({
      message: 'Farm documentation Created Successfully',
      FarmDocumentation: FarmDocumentation
    });

  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'Failed to create Farm documentation');
  }
};