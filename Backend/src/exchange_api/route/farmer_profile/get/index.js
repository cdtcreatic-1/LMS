const farmerDal = require("cccommon/dal/farmer");
const farmDal = require("cccommon/dal/farms");
const farmsDocDal = require("cccommon/dal/farm_documentation");
const appErr = require("this_pkg/error");
const { frontend_host, app_url } = require("cccommon/config");

exports.handler = async (req, res) => {
  const successStatus = 200;
  const id_user = Number(req.params.id_user);

  if (!id_user) {
    appErr.send(req, res, "validation_error", "Missing id_user");
    return;
  }

  try {
    let farmerFound = await farmerDal.getUserFamerDataById(id_user);
    if (!farmerFound) {
      appErr.send(req, res, "user_not_found", "Farmer not found");
      return;
    }

    const farms = await farmDal.getFarmsByIdUser(id_user);
    let hasDocumentation = false;

    for (const farm of farms) {
      const farmDoc = await farmsDocDal.getFarmDocumentationByUserId(id_user);

      if (farmDoc) {
        hasDocumentation = true;
        break;
      }
    }

    farmerFound = farmerFound.toJSON ? farmerFound.toJSON() : farmerFound;

    if (farmerFound.User?.user_profile_photo) {
      farmerFound.User.user_profile_photo =
        app_url() + farmerFound.User.user_profile_photo;
    } else {
      farmerFound.User.user_profile_photo = null;
    }

    if (farmerFound.User?.user_cover_photo) {
      farmerFound.User.user_cover_photo =
        app_url() + farmerFound.User.user_cover_photo;
    } else {
      farmerFound.User.user_cover_photo = null;
    }

    if (farmerFound && farms.length > 0) {
      farmerFound["farm_name"] = farms[0].dataValues?.farm_name;
      farmerFound["farm_documentation"] = hasDocumentation;
    }

    console.log(farmerFound);
    res.status(successStatus).json(farmerFound);
    return;
  } catch (error) {
    console.log(error);
    appErr.handleRouteServerErr(req, res, error, "failed to get farmer data");
  }
};
