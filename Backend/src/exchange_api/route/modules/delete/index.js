const moduleDal = require('cccommon/dal/module');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const { id_module } = req.params;

    try {
        const deleted = await moduleDal.deleteModule(id_module);
        if (!deleted) {
            return appErr.send(req, res, 'module_not_found', 'Module not found');
        }
        res.status(200).send({ message: 'Module deleted successfully' });
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to delete module');
    }
};
