const submoduleDal = require('cccommon/dal/submodule');
const submoduleQuestionDal = require('cccommon/dal/submoduleQuestion');
const appErr = require('this_pkg/error');
const { frontend_host, app_url } = require('cccommon/config');

exports.handler = async (req, res) => {
  const id_submodule = Number(req.params.id_submodule);
  
  if (!id_submodule) {
    appErr.send(req, res, 'validation_error', 'Missing id_submodule');
    return;
  }

  const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (specialCharsRegex.test(req.params.id_submodule)) {
    appErr.send(req, res, 'validation_error', 'id_submodule contains special characters');
    return;
  }

  try {
    const submoduleExists = await submoduleDal.getSubmoduleById(id_submodule);
    if (!submoduleExists) {
        appErr.send(req, res, 'submodule_not_found', 'Submodule does not exists');
        return;
    }

    const question = await submoduleQuestionDal.getQuestionByIdSubmodule(id_submodule);

    res.status(200).json(question);
  } catch (error) {
    appErr.handleRouteServerErr(req, res, error, 'failed to get questions');
    return;
  }
};
