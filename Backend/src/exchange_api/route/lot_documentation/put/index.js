const FarmDocumentationDal = require('cccommon/dal/farm_documentation');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
  const id_farm = Number(req.params.id_farm);
  
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


  if (validationErrors.length) {
    appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(validationErrors));
    return;
  }

  try {
    const dataToUpdate = {
      id_farm
    };

    if (farm_documentation_id_document) {
      dataToUpdate.farm_documentation_id_document = farm_documentation_id_document.path;
    }

    if (farm_documentation_rut) {
      dataToUpdate.farm_documentation_rut = farm_documentation_rut.path;
    }

    if (farm_documentation_chamber_commerce) {
      dataToUpdate.farm_documentation_chamber_commerce = farm_documentation_chamber_commerce.path;
    }

    const updatedRows = await FarmDocumentationDal.updateFarmDocumentation(id_farm, dataToUpdate);

    if (updatedRows[0] === 0) {
      appErr.send(req, res, 'not_found', 'Farm documentation not found');
      return;
    }

    res.status(200).send({ message: 'Farm documentation updated successfully' });
  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'Failed to update Farm documentation');
  }
};