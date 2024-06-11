const objectiveDal = require("cccommon/dal/courseObjective");
const appErr = require("this_pkg/error");

exports.handler = async (req, res) => {
  try {
    const objectiveFound = await objectiveDal.getAllObjectives();

    if (!objectiveFound) {
      appErr.send(req, res, "objective_not_found", "Objectives not found");
      return;
    }

    res.status(200).json(objectiveFound);
  } catch (error) {
    appErr.handleRouteServerErr(req, res, error, "failed to get objectives ");
    return;
  }
};
