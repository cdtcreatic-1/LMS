const objectiveDal = require('cccommon/dal/courseObjective');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
  const id_objective = Number(req.params.id_objective);

  if (!id_objective) {
    appErr.send(req, res, 'validation_error', 'Missing id_objective');
    return;
  }

  const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (specialCharsRegex.test(req.params.id_objective)) {
    appErr.send(req, res, 'validation_error', 'id_objective contains special characters');
    return;
  }

  try {
    const objectiveFound = await objectiveDal.getObjectiveById(id_objective); 

    if (!objectiveFound) {
      appErr.send(req, res, 'objective_not_found', 'Objective not found');
      return;
    }

    res.status(200).json(objectiveFound);
  } catch (error) {
    appErr.handleRouteServerErr(req, res, error, 'failed to get objective by id');
    return;
  }
};
