const lotPhotoDal = require('cccommon/dal/lot_photo');
const { deleteFile } = require('cccommon/file_utils');
const appErr = require('this_pkg/error');
const path = require('path');
const { frontend_host, app_url } = require('cccommon/config');

const validateImage = (file) => {
  const errors = [];
  if (file) {
    const maxFileSize = 1 * 1024 * 1024;
    const allowedFileTypes = ['.jpg', '.jpeg', '.png'];

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
  let id_lot = Number(req.params.id_lot);
  let lot_photo = req.files?.lot_photo?.[0];

  const validationErrors = [];

  if (!id_lot || isNaN(id_lot) || id_lot <= 0 || !Number.isInteger(id_lot)) {
    validationErrors.push({ id_lot: 'id_lot must be a positive integer' });
  }

  const imageErrors = validateImage(lot_photo);
  validationErrors.push(...imageErrors);

  if (validationErrors.length) {
    appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(validationErrors));
    return;
  }

  try {
    const existingLotPhoto = await lotPhotoDal.getLotPhotoByIdLot(id_lot);

    if (!existingLotPhoto) {
      appErr.send(req, res, 'not_found', 'Lot photo not found');
      return;
    }

    if (existingLotPhoto.dataValues.lot_photo) {
      await deleteFile(existingLotPhoto.dataValues.lot_photo);
    }

    const updatedRows = await lotPhotoDal.updateLotPhoto(id_lot, {
      id_lot, 
      lot_photo: lot_photo ? app_url() + lot_photo.path : null
    });

    res.status(200).send({ message: 'Lot photo updated successfully', updatedRows });
  } catch (error) {
    appErr.handleRouteServerErr(req, res, error, 'Failed to update lot photo');
  }
};
