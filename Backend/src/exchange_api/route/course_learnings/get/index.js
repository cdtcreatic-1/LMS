const learningDal = require('cccommon/dal/courseLearning');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
  const id_learning = Number(req.params.id_learning);

  if (!id_learning) {
    appErr.send(req, res, 'validation_error', 'Missing id_learning');
    return;
  }

  const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (specialCharsRegex.test(req.params.id_learning)) {
    appErr.send(req, res, 'validation_error', 'id_learning contains special characters');
    return;
  }

  try {
    const learningFound = await learningDal.getLearningById(id_learning); 

    if (!learningFound) {
      appErr.send(req, res, 'learning_not_found', 'Learning not found');
      return;
    }

    res.status(200).json(learningFound);
  } catch (error) {
    appErr.handleRouteServerErr(req, res, error, 'failed to get learning by id');
    return;
  }
};
