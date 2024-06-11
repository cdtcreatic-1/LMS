const answerDal = require('cccommon/dal/submoduleAnswer');
const appErr = require('this_pkg/error');
const {frontend_host, app_url} = require('cccommon/config');

exports.handler = async (req, res) => {
  const id_answer = Number(req.params.id_answer);
  if (!id_answer) {
    appErr.send(req, res, 'validation_error', 'Missing id_answer');
    return;
  }

  const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (specialCharsRegex.test(req.params.id_answer)) {
    appErr.send(req, res, 'validation_error', 'id_answer contains special characters');
    return;
  }

  try {
    const answerFound = await answerDal.getAnswerById(id_answer);

    if (!answerFound) {
      appErr.send(req, res, 'answer_not_found', 'Answer not found');
      return;
    }

    res.status(200).json(answerFound);
  } catch (error) {
    appErr.handleRouteServerErr(req, res, error, 'failed to get answer by id');
    return;
  }
};
