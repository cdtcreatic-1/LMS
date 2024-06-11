const farmsDal = require("cccommon/dal/farms");
const lotsDal = require("cccommon/dal/lots");
const cartDal = require('cccommon/dal/cart');
const purchaseDal = require('cccommon/dal/purchase');
const farmsAddDal = require("cccommon/dal/farms_additional_info");
const appErr = require("this_pkg/error");

function safeStringify(obj) {
  const cache = new Set();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (cache.has(value)) {
        return;
      }
      cache.add(value);
    }
    return value;
  });
}

exports.handler = async (req, res) => {
  const id_user = Number(req.params.id_user);

  if (!id_user) {
    appErr.send(req, res, "validation_error", "Missing id_user");
    return;
  }

  try {
    const farmerFound = await farmsDal.getFarmsByIdUser(id_user);

    if (!farmerFound) {
      appErr.send(req, res, "not_found", "No farms found for this user");
      return;
    }

    if (farmerFound.length === 0) {
      return res
        .status(200)
        .json({ message: "Not farms registered", data: [] });
    }

    let data = []
    for (let i = 0; i < farmerFound.length; i++) {

      let lots = await lotsDal.getLotsByFarmId(farmerFound[i].dataValues.id_farm);

      if (lots && lots.length > 0 && lots != []) {
        for (let j = 0; j < lots.length; j++) {

          let res = await cartDal.getCartDataByIdLot(lots[j].dataValues.id_lot);
          let res2 = await purchaseDal.getPurchasesByIdLot(lots[j].dataValues.id_lot);

          if (res && res != [] && res.length > 0 && res2 && res2 != [] && res2.length > 0 && (res2[0]?.dataValues?.id_purchase_status === 1 || res2[0]?.dataValues?.id_purchase_status === 2)) {
            farmerFound[i].dataValues.is_in_purchase = true;
          } else {
            farmerFound[i].dataValues.is_in_purchase = false;
          }
        }
      }

      data.push(farmerFound[i]);
    }

    const farmsWithAdditionalInfo = await Promise.all(
      data.map(async (farm) => {
        const farmData = farm.get();
        const additionalInfo = await farmsAddDal.getFarmAdditionalInfoById(
          farm.id_farm
        );

        return {
          id_farm: farmData.id_farm,
          farm_name: farmData.farm_name,
          farm_number_lots: farmData.farm_number_lots,
          village_name: farmData.Village.village_name,
          city_name: farmData.Village.City.city_name,
          state_name: farmData.Village.City.State.state_name,
          additionalInfo: additionalInfo ? additionalInfo.get() : null,
          is_in_purchase: farmData?.is_in_purchase || false
        };
      })
    );

    res
      .status(200)
      .json({
        message: "Data Founded Successfully",
        data: JSON.parse(safeStringify(farmsWithAdditionalInfo)),
      });
  } catch (error) {
    appErr.handleRouteServerErr(req, res, error, "failed to get farmer data");
  }
};
