const FarmDocumentationDal = require('cccommon/dal/farm_documentation');
const appErr = require('this_pkg/error');
const path = require('path'); 

exports.handler = async (req, res) => {

  const id_user = Number(req.body.id_user);
  
  let farm_documentation_id_document = null;
  let farm_documentation_rut = null;
  let farm_documentation_chamber_commerce = null;

  if (req.files?.farm_documentation_id_document) {
    farm_documentation_id_document = req.files.farm_documentation_id_document[0];
  }
  
  if ( req.files?.farm_documentation_rut) {
    farm_documentation_rut = req.files.farm_documentation_rut[0];
  }

  if (req.files?.farm_documentation_chamber_commerce) {
    farm_documentation_chamber_commerce = req.files.farm_documentation_chamber_commerce[0];
  }

  const validationErrors = [];

  if (!id_user) {
    validationErrors.push({ id_user: 'missing' });
  }

  if (!Number.isInteger(id_user) || id_user <= 0) {
    validationErrors.push({ id_user: 'Invalid id_user' });
  }

  const maxFileSize = 3 * 1024 * 1024;
  const allowedFileTypes = ['.pdf', '.doc', '.docx']; 

  if (farm_documentation_id_document) {
    if (farm_documentation_id_document.size > maxFileSize) {
      validationErrors.push({ farm_documentation_id_document: 'File size exceeds limit' });
    }
    const fileExtension = path.extname(farm_documentation_id_document.originalname).toLowerCase();
    if (!allowedFileTypes.includes(fileExtension)) {
      validationErrors.push({ farm_documentation_id_document: 'Invalid file type' });
    }
  }

  if (validationErrors.length) {
    appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(validationErrors));
    return;
  }

  try {
    const dataToUpdate = {};

    if (farm_documentation_id_document) {
      dataToUpdate.farm_documentation_id_document = farm_documentation_id_document.path;
    }

    if (farm_documentation_rut) {
      dataToUpdate.farm_documentation_rut = farm_documentation_rut.path;
    }

    if (farm_documentation_chamber_commerce) {
      dataToUpdate.farm_documentation_chamber_commerce = farm_documentation_chamber_commerce.path;
    }

    const updatedRows = await FarmDocumentationDal.updateFarmDocumentation(id_user, dataToUpdate);

    if (updatedRows[0] === 0) {
      appErr.send(req, res, 'not_found', 'Farm documentation not found');
      return;
    }

    res.status(200).send({ message: 'Farm documentation updated successfully' });
  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'Failed to update Farm documentation');
  }
};
