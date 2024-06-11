const models = require("cccommon/models/internaldb");
const { frontend_host, app_url } = require("cccommon/config");

//Fill the lots table with some data
async function createLots(lotsData) {
  try {
    const newLots = models.Lots.build(lotsData);
    const savedLots = await newLots.save();
    return savedLots;
  } catch (error) {
    throw new Error(`Error creating lots: ${error.message}`);
  }
}

//Update the lots table with some data using farm id
async function updateLots(lotsData) {
  try {
    const updated = await models.Lots.update(lotsData, {
      where: { id_lot: lotsData.id_lot },
    });

    if (updated[0] === 0) {
      throw new Error("No records updated");
    }

    const updatedLot = await models.Lots.findOne({
      where: { id_lot: lotsData.id_lot },
    });

    if (!updatedLot) {
      throw new Error("Could not retrieve updated record");
    }

    return updatedLot;
  } catch (error) {
    throw new Error(`Error updating lots: ${error.message}`);
  }
}

//Get lots by id_farm
async function getLotsByFarmId(id_farm) {
  try {
    const lots = await models.Lots.findAll({ where: { id_farm: id_farm } });
    return lots;
  } catch (error) {
    throw new Error(`Error getting lots by id_farm: ${error.message}`);
  }
}

//Get lots all info by id_farm
async function getLotsInfoByFarmId(id_farm, is_completed = true) {
  try {
    const lots = await models.Lots.findAll({
      where: {
        id_farm: id_farm,
        is_completed: is_completed,
        lot_status: true,
      },      
      include: [
        {
          model: models.CoffeeProfile,
          attributes: ["profile_name"],
        },
        {
          model: models.CoffeeVariations,
          attributes: ["variety_name"],
        },
        {
          model: models.RoastingType,
          attributes: ["roasting_name"],
        },
        {
          model: models.LotQuantity,
          attributes: ["total_quantity", "samples_quantity", "price_per_kilo"],
          include: [
            {
              model: models.Associations,
              attributes: ["association_name"],
            },
          ],
        },
        {
          model: models.LotPhoto,
          attributes: ["lot_photo"],
        },
        {
          model: models.LotSummary,
          attributes: [
            "germination_summary",
            "sown_summary",
            "harvest_summary",
            "drying_summary",
            "roasting_summary",
            "packaging_summary",
          ],
        },
      ],
      attributes: ["id_lot"],
    });

    return lots;
  } catch (error) {
    throw new Error(`Error fetching lots by farm ID: ${error.message}`);
  }
}

//Get lots all info by id_lot
async function getLotsInfoByLotId(id_lot) {
  try {
    const lots = await models.Lots.findAll({
      where: { id_lot: id_lot, lot_status: true },
      include: [
        {
          model: models.CoffeeProfile,
          attributes: ["profile_name"],
        },
        {
          model: models.CoffeeVariations,
          attributes: ["variety_name"],
        },
        {
          model: models.RoastingType,
          attributes: ["roasting_name"],
        },
        {
          model: models.LotQuantity,
          attributes: ["total_quantity", "samples_quantity"],
          include: [
            {
              model: models.Associations,
              attributes: ["association_name"],
            },
          ],
        },
        {
          model: models.LotPhoto,
          attributes: ["lot_photo"],
        },
      ],
      attributes: ["id_lot"],
    });

    return lots;
  } catch (error) {
    throw new Error(`Error fetching lots by farm ID: ${error.message}`);
  }
}

// Get lot by id
async function getLotById(id_farm) {
  try {
    const lots = await models.Lots.findOne({
      where: {
        id_farm: id_farm,
        lot_status: true,
      },
    });
    return lots;
  } catch (error) {
    throw new Error(`Error getting lot by id_lot : ${error.message}`);
  }
}

async function getLotByIdLot(id_lot) {
  try {
    const lots = await models.Lots.findOne({
      where: {
        id_lot: id_lot,
        lot_status: true,
      },
    });
    return lots;
  } catch (error) {
    throw new Error(`Error getting lot by id_lot : ${error.message}`);
  }
}

//Get number lot
async function getNumberLots(id_farm) {
  try {
    const lots = await models.Farms.findAll({
      where: {
        id_farm: id_farm,
      },
      attributes: ["farm_number_lots"],
    });
    return lots;
  } catch (error) {
    throw new Error(`Error getting number lots: ${error.message}`);
  }
}

//Get coffee variety
async function getCoffeeVariety(id_farm) {
  try {
    const lots = await models.Lots.findAll({
      where: {
        id_farm: id_farm,
      },
      attributes: ["id_variety"],
      include: [
        {
          model: models.CoffeeVariations,
          attributes: ["variety_name"],
        },
      ],
    });
    return lots;
  } catch (error) {
    throw new Error(`Error getting coffee variety: ${error.message}`);
  }
}

//Get coffee profile
async function getCoffeeProfile(id_farm) {
  try {
    const lots = await models.Lots.findAll({
      where: {
        id_farm: id_farm,
      },
      attributes: ["id_profile"],
      include: [
        {
          model: models.CoffeeProfile,
          attributes: ["profile_name"],
        },
      ],
    });
    return lots;
  } catch (error) {
    throw new Error(`Error getting coffee profile: ${error.message}`);
  }
}

//Get coffee roasting
async function getCoffeeRoasting(id_farm) {
  try {
    const lots = await models.Lots.findAll({
      where: {
        id_farm: id_farm,
      },
      attributes: ["id_roast"],
      include: [
        {
          model: models.RoastingType,
          attributes: ["roasting_name"],
        },
      ],
    });
    return lots;
  } catch (error) {
    throw new Error(`Error getting number lots: ${error.message}`);
  }
}

async function getLotsInfoByUser(id_farm) {
  try {
    const lots = await models.Lots.findAll({
      where: { id_farm: id_farm },
      include: [
        {
          model: models.LotQuantity,
          attributes: ["price_per_kilo"],
        },
        {
          model: models.CoffeeProfile,
          attributes: ["profile_name"],
        },
        {
          model: models.LotPhoto,
          attributes: ["lot_photo"],
        },
        {
          model: models.ScoreLots,
          attributes: ["score"],
        },
      ],
      attributes: ["id_farm", "id_lot"],
    });

    return lots;
  } catch (error) {
    throw new Error(`Error getting lots: ${error.message}`);
  }
}

async function updatelotIsCompleted(id_lot, is_completed) {
  try {
    const lotsData = {
      is_completed: is_completed,
    };
    const updated = await models.Lots.update(lotsData, {
      where: { id_lot: id_lot },
    });
    if (updated[0] === 0) {
      throw new Error("No records updated");
    }
    const updatedLot = await models.Lots.findOne({ where: { id_lot: id_lot } });
    if (!updatedLot) {
      throw new Error("Could not retrieve updated record");
    }
    return updatedLot;
  } catch (error) {
    throw new Error(`Error updating lots: ${error.message}`);
  }
}

async function deleteLotById(id_lot) {
  try {
    const lotQuantity = await models.LotQuantity.findOne({
      where: {
        id_lot: id_lot,
      },
    });
    if (lotQuantity) {
      await models.LotQuantity.destroy({
        where: {
          id_lot: id_lot,
        },
      });
    }

    const lotSummary = await models.LotSummary.findOne({
      where: {
        id_lot: id_lot,
      },
    });
    if (lotSummary) {
      await models.LotSummary.destroy({
        where: {
          id_lot: id_lot,
        },
      });
    }

    const LotPhoto = await models.LotPhoto.findOne({
      where: {
        id_lot: id_lot,
      },
    });
    if (LotPhoto) {
      await models.LotPhoto.destroy({
        where: {
          id_lot: id_lot,
        },
      });
    }

    const FarmDocumentation = await models.FarmDocumentation.findOne({
      where: {
        id_lot: id_lot,
      },
    });
    if (FarmDocumentation) {
      await models.FarmDocumentation.destroy({
        where: {
          id_lot: id_lot,
        },
      });
    }

    const LotCertifications = await models.LotCertifications.findOne({
      where: {
        id_lot: id_lot,
      },
    });
    if (LotCertifications) {
      await models.LotCertifications.destroy({
        where: {
          id_lot: id_lot,
        },
      });
    }

    const ScoreLots = await models.ScoreLots.findOne({
      where: {
        id_lot: id_lot,
      },
    });
    if (ScoreLots) {
      await models.ScoreLots.destroy({
        where: {
          id_lot: id_lot,
        },
      });
    }

    const lots = await models.Lots.findOne({
      where: {
        id_lot: id_lot,
      },
    });
    if (lots) {
      await models.Lots.destroy({
        where: {
          id_lot: id_lot,
        },
      });
    }
  } catch (err) {
    throw new Error(`Error deleting lot and related data: ${err.message}`);
  }
}

const getLotData = async (id_user) => {
  try {
    const data = await models.Lots.findAll({
      attributes: ["id_lot", "lot_number"],
      include: [
        {
          model: models.Farms,
          attributes: ["farm_name"],
          required: true,
          include: [
            {
              model: models.User,
              attributes: [
                "id_user",
                "user_name",
                "user_profile_photo",
                "user_phone",
                "user_email",
                "user_username",
                "user_cover_photo",
              ],
              where: { 
                id_user: { [models.Sequelize.Op.ne]: id_user } 
              },
              required: true,
              include: [
                {
                  model: models.user_information,
                  attributes: [
                    "user_personal_description_text",
                    "id_type_of_information",
                  ],
                  as: "user_information",
                  required: true,
                },
              ],
            },
            {
              model: models.FarmPhotos,
              attributes: ["farm_photo_1", "farm_photo_2", "farm_photo_3"],
            },
          ],
        },
        {
          model: models.CoffeeProfile,
          attributes: ["profile_name"],
          required: true,
        },
        {
          model: models.RoastingType,
          attributes: ["roasting_name"],
          required: true,
        },
      ],
    });

    //const result = [];
    let count = 0;
    let temp_farm_photos = null;
    const intermediateResult = {};
    data.forEach((lots) => {
      const Farm =
        lots && lots.dataValues && lots.dataValues.Farm
          ? lots.dataValues.Farm.dataValues
          : null;
      const FarmPhotos =
        Farm && Farm.FarmPhoto ? Farm.FarmPhoto.dataValues : null;
      const User = Farm && Farm.User ? Farm.User.dataValues : null;
      const CoffeeProfile =
        lots && lots.dataValues && lots.dataValues.CoffeeProfile
          ? lots.dataValues.CoffeeProfile.dataValues
          : null;
      const CoffeProfileName = CoffeeProfile.profile_name;
      const id_user = User.id_user;
      const user_name = User.user_name;
      const UserInfo = User.user_information;
      const id_farm = Farm.id_farm;
      const farm_name = Farm.farm_name;
      const user_profile_photo = User.user_profile_photo
        ? User.user_profile_photo
        : null;

      if (FarmPhotos && count % 3 === 0) {
        temp_farm_photos = FarmPhotos.farm_photo_1
          ? app_url() + FarmPhotos.farm_photo_1
          : null;
      } else if (FarmPhotos && count % 3 === 1) {
        temp_farm_photos = FarmPhotos.farm_photo_2
          ? app_url() + FarmPhotos.farm_photo_2
          : null;
      } else if (FarmPhotos && count % 3 === 2) {
        temp_farm_photos = FarmPhotos.farm_photo_3
          ? app_url() + FarmPhotos.farm_photo_3
          : null;
      }

      /*const lot = {
          id_lot: lots.id_lot,
          lot_number: lots.lot_number,
          profile_name: lots.CoffeeProfile.dataValues.profile_name,
          roasting_name: lots.RoastingType.dataValues.roasting_name,
          product_avaliable_amount: lots.product_avaliable_amount,
          price_per_kilo: lots.price_per_kilo,
          product_production_description_text: lots.product_production_description_text,
          farm_photo: temp_farm_photos
      };*/

      if (!intermediateResult[user_name]) {
        intermediateResult[user_name] = {
          id_user,
          user_name,
          user_phone: User.user_phone,
          user_email: User.user_email,
          user_username: User.user_username,
          user_cover_photo: User.user_cover_photo ? app_url() + User.user_cover_photo: null,
          user_profile_photo: User.user_profile_photo ? app_url() + User.user_profile_photo: null,
          user_personal_description_text: UserInfo
            ? UserInfo.user_personal_description_text
            : null,
          id_type_of_information: UserInfo
            ? UserInfo.id_type_of_information
            : null,
          profile_name: CoffeProfileName,
          farm_name,
          //lots_information: []
        };
        count++;
      }

      //intermediateResult[user_name].lots_information.push(lot);

      // Sort the lots_information by lot_number
      //intermediateResult[user_name].lots_information.sort((a, b) => a.lot_number - b.lot_number);
    });

    const result = Object.values(intermediateResult);

    return result;
  } catch (error) {
    throw new Error(`Error getting lot data: ${error.message}`);
  }
};

async function findUserIdByIdLot(id_lot) {
  const lot = await models.Lots.findOne({
    where: { id_lot: id_lot },
    include: [
      {
        model: models.Farms,
        attributes: ["id_user"],
      },
    ],
  });

  const lotJson = lot.toJSON();

  if (lotJson && lotJson.Farm) {
    return lot.Farm.id_user;
  }
  return null;
}

module.exports = {
  createLots,
  getLotById,
  updateLots,
  getLotsByFarmId,
  getLotsInfoByFarmId,
  getLotData,
  getNumberLots,
  getCoffeeVariety,
  getCoffeeProfile,
  getCoffeeRoasting,
  getLotsInfoByUser,
  deleteLotById,
  getLotByIdLot,
  getLotsInfoByLotId,
  findUserIdByIdLot,
  updatelotIsCompleted,
};
