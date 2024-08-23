const villagesDal = require("cccommon/dal/villages");
const appErr = require("this_pkg/error");

exports.handler = async (req, res) => {
  // Get user_id from params
  const id_city = Number(req.params.id_city);

  if (!id_city) {
    appErr.send(req, res, "validation_error", "Missing id_city");
    return;
  }

  try {
    // Get user from database
    let villagesFound = await villagesDal.getVillagesWithIdCity(id_city);

    // Check if user exists

    if (!villagesFound) {
      appErr.send(req, res, "villages_not_found", "Villages not found");
      return;
    }

    // Send user data

    res.status(200).json(villagesFound);
  } catch (error) {
    appErr.handleRouteServerErr(
      req,
      res,
      error,
      "failed to get Villages in Cauca"
    );
    return;
  }
};
