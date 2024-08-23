const objectiveDal = require('cccommon/dal/courseObjective');
const appErr = require('this_pkg/error');
const { frontend_host, app_url } = require('cccommon/config');

exports.handler = async (req, res) => {
    const { id_course } = req.params;

    try {
        const objectives = await objectiveDal.getObjectivesByIdCourse(id_course);

        res.status(200).json({ objectives });
    } catch (error) {
        appErr.handleRouteServerErr(req, res, error, 'failed to get objectives');
        return;
    }
};