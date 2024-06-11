const moduleDal = require('cccommon/dal/module');
const appErr = require('this_pkg/error');
const { frontend_host, app_url } = require('cccommon/config');

exports.handler = async (req, res) => {
    const { id_course } = req.params;

    try {
        const modules = await moduleDal.getModulesByIdCourse(id_course);

        res.status(200).json({ modules });
    } catch (error) {
        appErr.handleRouteServerErr(req, res, error, 'failed to get modules');
        return;
    }
};