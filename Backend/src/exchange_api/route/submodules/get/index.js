const submoduleDal = require('cccommon/dal/submodule');
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
    const submoduleFound = await submoduleDal.getSubmoduleById(id_submodule);

    if (!submoduleFound) {
      appErr.send(req, res, 'submodule_not_found', 'Submodule not found');
      return;
    }

    if (submoduleFound?.submodule_resources) {
      submoduleFound.submodule_resources = app_url() + submoduleFound.submodule_resources;
    } else {
      submoduleFound.submodule_resources = null;
    }

    res.status(200).json(submoduleFound);
  } catch (error) {
    appErr.handleRouteServerErr(req, res, error, 'failed to get submodule by id');
    return;
  }
};
