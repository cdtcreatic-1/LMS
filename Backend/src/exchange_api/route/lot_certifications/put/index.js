const lotCertificationDal = require('cccommon/dal/lot_certifications');
const lotDal = require('cccommon/dal/lots');
const appErr = require('this_pkg/error');
const path = require('path');
const { frontend_host, app_url } = require('cccommon/config');

const validateFile = (file, fieldName) => {
  const errors = [];
  if (file) {
    const maxFileSize = 3 * 1024 * 1024;
    const allowedFileTypes = ['.pdf', '.docx', '.doc']; 

    if (file.size > maxFileSize) {
      errors.push({ [fieldName]: 'File size exceeds limit' });
    }
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!allowedFileTypes.includes(fileExtension)) {
      errors.push({ [fieldName]: 'Invalid file type' });
    }
  } else {
    errors.push({ [fieldName]: 'File missing' });
  }
  return errors;
};

exports.handler = async (req, res) => {
  let id_lot = Number(req.params.id_lot);
  let product_sc_certificate = req.files?.product_sc_certificate?.[0];
  let product_taster_certificate = req.files?.product_taster_certificate?.[0];
  const contact_qgrader = req.body.contact_qgrader;

  const validationErrors = [];

  if (!id_lot || isNaN(id_lot) || id_lot <= 0 || !Number.isInteger(id_lot)) {
    validationErrors.push({ id_lot: 'id_lot must be a positive integer' });
  }

  validationErrors.push(...validateFile(product_sc_certificate, 'product_sc_certificate'));
  validationErrors.push(...validateFile(product_taster_certificate, 'product_taster_certificate'));

  if (typeof contact_qgrader === 'undefined') {
    validationErrors.push({ contact_qgrader: 'missing' });
  }

  if (validationErrors.length) {
    appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(validationErrors));
    return;
  }

  try {
    const lotExists = await lotDal.getLotById(id_lot);
    if (!lotExists) {
      appErr.send(req, res, 'lot_not_found', 'Lot not found');
      return;
    }

    const updatedCertification = await lotCertificationDal.updateLotCertification(id_lot, {
      product_sc_certificate: product_sc_certificate ? app_url() + product_sc_certificate.path : null,
      product_taster_certificate: product_taster_certificate ? app_url() + product_taster_certificate.path : null,
      contact_qgrader
    });

    if (!updatedCertification) {
      appErr.send(req, res, 'not_found', 'Lot certification not found');
      return;
    }

    res.status(200).send({
      message: 'Lot Certification Updated Successfully',
      lotCertification: updatedCertification
    });
  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'Failed to update lot certification');
  }
};
