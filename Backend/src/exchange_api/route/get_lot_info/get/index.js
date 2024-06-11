const lotDal = require('cccommon/dal/lots');
const cartDal = require('cccommon/dal/cart');
const purchaseDal = require('cccommon/dal/purchase');
const appErr = require('this_pkg/error');
const { frontend_host, app_url } = require('cccommon/config');

exports.handler = async (req, res) => {
  const id_farm = Number(req.params.id_farm);
  const is_completed = true;
  try {
    let lots = await lotDal.getLotsInfoByFarmId(id_farm, is_completed);

    if (lots && lots.length > 0) {
      lots = lots.map(lot => {
        if (lot.dataValues && lot.dataValues.LotPhoto && lot.dataValues.LotPhoto.lot_photo) {
          lot.dataValues.LotPhoto.lot_photo = app_url() + lot.dataValues.LotPhoto.lot_photo;
        }
        return lot;
      });
    } else {
      res.status(200).json({
        message: 'No lots found for this farm',
        data: []
      });
      return;
    }

    let data = []
    for (let i = 0; i < lots.length; i++) {
      let res = await cartDal.getCartDataByIdLot(lots[i].id_lot);
      let res2 = await purchaseDal.getPurchasesByIdLot(lots[i].id_lot);    

      if (res && res != [] && res.length > 0 && res2 && res2 != [] && res2.length > 0 && (res2[0]?.dataValues?.id_purchase_status === 1 || res2[0]?.dataValues?.id_purchase_status === 2)) {
        lots[i].dataValues.is_in_purchase = true;
      } else {
        lots[i].dataValues.is_in_purchase = false;
      }

      data.push(lots[i]);
    }

    res.status(200).json({
      message: 'Lots retrieved successfully',
      data: data
    });
  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'Failed to fetch lots');
  }
};
