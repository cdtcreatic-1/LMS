const models = require("cccommon/models/internaldb");
const farmsDal = require("cccommon/dal/farms");
const lotsDal = require("cccommon/dal/lots");
const appErr = require("this_pkg/error");

exports.handler = async (req, res) => {
  const id_farm = Number(req.params.id_farm);

  const successStatus = 200;

  if (!Number.isInteger(id_farm) || id_farm <= 0) {
    appErr.send(req, res, "validation_error", "Invalid id_farm");
    return;
  }

  try {
    const farmExists = await farmsDal.getFarmsByIdFarm(id_farm);

    if (farmExists.length == 0) {
      appErr.send(
        req,
        res,
        "not_found",
        `Farm with id ${id_farm} does not exist`
      );
      return;
    }
    await farmsDal.updateFarm({
      id_farm,
      farm_status: false,
    });

    await models.Lots.update(
      { lot_status: false },
      {
        where: { id_farm },
      }
    );
    /*await scorelotsDal.deleteScoreLots(id_farm);
        await farmsDal.deleteFarmById(id_farm);*/

    res.status(successStatus).send({
      message: "Farm and related data deleted successfully",
    });
  } catch (err) {
    appErr.handleRouteServerErr(
      req,
      res,
      err,
      "Failed to delete farm and its related data"
    );
    return;
  }
};
