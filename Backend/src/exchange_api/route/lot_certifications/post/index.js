const lotCertificationDal = require('cccommon/dal/lot_certifications');
const lotDal = require('cccommon/dal/lots');
const appErr = require('this_pkg/error');
const path = require('path');
const { frontend_host, app_url } = require('cccommon/config');

const validateFile = (file, fieldName) => {
  const errors = [];
  if (file) {
    const maxFileSize = 3 * 1024 * 1024;
    const allowedFileTypes = ['.pdf', '.jpg', '.png'];

    if (file.size > maxFileSize) {
      errors.push({ [fieldName]: 'File size exceeds limit' });
    }
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!allowedFileTypes.includes(fileExtension)) {
      errors.push({ [fieldName]: 'Invalid file type' });
    }
  }

  return errors;
};

exports.handler = async (req, res) => {
  const successStatus = 201;
  let id_lot = req.body.id_lot;
  let product_sc_certificate = req.files?.product_sc_certificate?.[0];
  let product_taster_certificate = req.files?.product_taster_certificate?.[0];
  const contact_qgrader = req.body.contact_qgrader;

  const validationErrors = [];

  if (!id_lot) {
    validationErrors.push({ id_lot: 'missing' });
  } else {
    id_lot = Number(id_lot);
    if (isNaN(id_lot) || id_lot <= 0 || !Number.isInteger(id_lot)) {
      validationErrors.push({ id_lot: 'id_lot must be a positive integer' });
    }
  }

  if (product_sc_certificate) {
    validationErrors.push(...validateFile(product_sc_certificate, 'product_sc_certificate'));
  }

  if (product_taster_certificate) {
    validationErrors.push(...validateFile(product_taster_certificate, 'product_taster_certificate'));
  }

  if (typeof contact_qgrader === 'undefined') {
    validationErrors.push({ contact_qgrader: 'missing' });
  }

  if (validationErrors.length) {
    appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(validationErrors));
    return;
  }

  try {
    const lotExists = await lotDal.getLotByIdLot(id_lot);
    if (!lotExists) {
      appErr.send(req, res, 'lot_not_found', 'Lot not found');
      return;
    }

    const lotCertificationExists = await lotCertificationDal.getLotCertificationById(id_lot);
    if (lotCertificationExists) {
      appErr.send(req, res, 'lot_certification_exist', 'Lot Certification already exists');
      return;
    }

    let lotCertification;

    if (product_sc_certificate && product_taster_certificate) {
      lotCertification = await lotCertificationDal.createLotCertification({
        id_lot,
        product_sc_certificate: app_url() + product_sc_certificate.path,
        product_taster_certificate: app_url() + product_taster_certificate.path,
        contact_qgrader
      });      
    } else if (product_sc_certificate && !product_taster_certificate) {
      lotCertification = await lotCertificationDal.createLotCertification({
        id_lot,
        product_sc_certificate: app_url() + product_sc_certificate.path,
        contact_qgrader
      });      
    } else if (!product_sc_certificate  && product_taster_certificate) {
      lotCertification = await lotCertificationDal.createLotCertification({
        id_lot,
        product_taster_certificate: app_url() + product_taster_certificate.path,
        contact_qgrader
      });      
    }
    else {
      lotCertification = await lotCertificationDal.createLotCertification({
        id_lot,
        contact_qgrader
      });      
    }

    res.status(successStatus).send({
      message: 'Lot Certification Created Successfully',
      lotCertification: lotCertification
    });

  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'Failed to create lot certification');
  }
};
