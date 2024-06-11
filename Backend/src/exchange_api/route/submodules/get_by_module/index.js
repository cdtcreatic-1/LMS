const submoduleDal = require('cccommon/dal/submodule');
const moduleDal = require('cccommon/dal/module');
const appErr = require('this_pkg/error');
const { frontend_host, app_url } = require('cccommon/config');

exports.handler = async (req, res) => {
  const id_module = Number(req.params.id_module);
  
  if (!id_module) {
    appErr.send(req, res, 'validation_error', 'Missing id_module');
    return;
  }

  const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (specialCharsRegex.test(req.params.id_module)) {
    appErr.send(req, res, 'validation_error', 'id_module contains special characters');
    return;
  }

  try {
    const moduleFound = await moduleDal.getModuleById(id_module);

    if (!moduleFound) {
      appErr.send(req, res, 'submodule_not_found', 'Submodule not found');
      return;
    }

    const submoduleFound = await submoduleDal.getSubmodulesByModule(id_module, true);

    res.status(200).json(submoduleFound);
  } catch (error) {
    appErr.handleRouteServerErr(req, res, error, 'failed to get submodule by id');
    return;
  }
};
