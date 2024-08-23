const lotPhotoDal = require('cccommon/dal/lot_photo');
const lotDal = require('cccommon/dal/lots');
const appErr = require('this_pkg/error');
const path = require('path');
const { frontend_host, app_url } = require('cccommon/config');

const validateImage = (file) => {
  const errors = [];
  if (file) {
    const maxFileSize = 3 * 1024 * 1024;
    const allowedFileTypes = ['.pdf', '.jpg'];

    if (file.size > maxFileSize) {
      errors.push({ lot_photo: 'Image size exceeds 1 MB limit' });
    }
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!allowedFileTypes.includes(fileExtension)) {
      errors.push({ lot_photo: 'Invalid image type' });
    }
  } else {
    errors.push({ lot_photo: 'Image missing' });
  }
  return errors;
};

exports.handler = async (req, res) => {
  let id_lot = req.body.id_lot;
  let lot_photo = req.files?.lot_photo?.[0];

  const validationErrors = [];

  if (!id_lot) {
    validationErrors.push({ id_lot: 'missing' });
  } else {
    id_lot = Number(id_lot);
    if (isNaN(id_lot) || id_lot <= 0 || !Number.isInteger(id_lot)) {
      validationErrors.push({ id_lot: 'id_lot must be a positive integer' });
    }
  }

  const imageErrors = validateImage(lot_photo);
  validationErrors.push(...imageErrors);

  if (validationErrors.length) {
    appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(validationErrors));
    return;
  }

  try {
    const lotExist = await lotDal.getLotByIdLot(id_lot)
    if (!lotExist) {
      appErr.send(req, res, 'lot_not_found', 'Lot not found');
      return;
    }
    const newLotPhoto = await lotPhotoDal.createLotPhoto({
      id_lot, 
      lot_photo: lot_photo ? lot_photo.path : null
    });
    if(newLotPhoto){
      await lotDal.updatelotIsCompleted (id_lot, true);
    }
    res.status(201).json({ 
      message: 'Lot photo created successfully', 
      newLotPhoto: {
        ...newLotPhoto.dataValues,
        lot_photo: newLotPhoto.dataValues.lot_photo ? app_url() + newLotPhoto.dataValues.lot_photo : null
      }
    });
  } catch (error) {
    appErr.handleRouteServerErr(req, res, error, 'Failed to create lot photo');
  }
};
