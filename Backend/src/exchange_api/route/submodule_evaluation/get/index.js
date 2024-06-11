const evaluationDal = require('cccommon/dal/submoduleEvaluation');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
  const id_evaluation = Number(req.params.id_evaluation);
  if (!id_evaluation) {
    appErr.send(req, res, 'validation_error', 'Missing id_evaluation');
    return;
  }

  const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (specialCharsRegex.test(req.params.id_evaluation)) {
    appErr.send(req, res, 'validation_error', 'id_evaluation contains special characters');
    return;
  }

  try {
    const evaluationFound = await evaluationDal.getEvaluationById(id_evaluation);

    if (!evaluationFound) {
      appErr.send(req, res, 'evaluation_not_found', 'Evaluation not found');
      return;
    }

    res.status(200).json(evaluationFound);
  } catch (error) {
    appErr.handleRouteServerErr(req, res, error, 'failed to get evaluation by id');
    return;
  }
};
