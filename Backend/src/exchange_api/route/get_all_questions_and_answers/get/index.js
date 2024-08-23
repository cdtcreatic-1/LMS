const submoduleDal = require('cccommon/dal/submodule');
const appErr = require('this_pkg/error');
const { app_url } = require('cccommon/config');

exports.handler = async (req, res) => {
    const id_submodule = req.params.id_submodule;

    if (!id_submodule) {
        appErr.send(req, res, "validation_error", "Missing id_submodule");
        return;
    }

    try {
        const submoduleInfo = await submoduleDal.getSubmoduleInfoById(id_submodule);
        if (!submoduleInfo) {
            appErr.send(req, res, 'submodule_not_found', 'Submodule not found');
            return;
        }

        if (submoduleInfo.submodule_resources) {
            submoduleInfo.submodule_resources = app_url() + submoduleInfo.submodule_resources;
        }

        res.status(200).json(submoduleInfo);
    } catch (error) {
        appErr.handleRouteServerErr(req, res, error, 'failed to get submodule info');
        return;
    }
};
