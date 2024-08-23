const submoduleDal = require('cccommon/dal/submodule');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const { id_submodule } = req.params;

    try {
        const deleted = await submoduleDal.deleteSubmodule(id_submodule);
        if (!deleted) {
            return appErr.send(req, res, 'submodule_not_found', 'Submodule not found');
        }
        res.status(200).send({ message: 'Submodule deleted successfully' });
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to delete submodule');
    }
};
