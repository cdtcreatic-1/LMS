const questionDal = require('cccommon/dal/submoduleQuestion');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
  const id_question = Number(req.params.id_question);
  if (!id_question) {
    appErr.send(req, res, 'validation_error', 'Missing id_question');
    return;
  }

  const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (specialCharsRegex.test(req.params.id_question)) {
    appErr.send(req, res, 'validation_error', 'id_question contains special characters');
    return;
  }

  try {
    const questionFound = await questionDal.getQuestionById(id_question);

    if (!questionFound) {
      appErr.send(req, res, 'question_not_found', 'Question not found');
      return;
    }

    res.status(200).json(questionFound);
  } catch (error) {
    appErr.handleRouteServerErr(req, res, error, 'failed to get question by id');
    return;
  }
};
