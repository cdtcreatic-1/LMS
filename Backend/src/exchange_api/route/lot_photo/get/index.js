const lotPhotoDal = require('cccommon/dal/lot_photo');
const appErr = require('this_pkg/error');
const {frontend_host, app_url} = require('cccommon/config');

exports.handler = async (req, res) => {
  const id_lot = Number(req.params.id_lot);

  if(!id_lot) {
    appErr.send(req, res, 'validation_error', 'Missing id_lot');
    return;
  }

  try {
    const lotPhoto = await lotPhotoDal.getLotPhotoByIdLot(id_lot);

    if(lotPhoto.dataValues?.lot_photo) {
      //Remove the word "uploads/" from the path
      lotPhoto.dataValues.lot_photo = app_url() + lotPhoto.dataValues.lot_photo;
    }
    if (!lotPhoto) {
      appErr.send(req, res, 'not_found', 'Lot photo not found');
      return;
    }
    res.status(200).json(lotPhoto);
  } catch (error) {
    appErr.handleRouteServerErr(req, res, error, 'Failed to get lot photo');
  }
};
