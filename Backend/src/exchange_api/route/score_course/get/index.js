const userCourseDal = require('cccommon/dal/user_course');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    let result = null;
    const successStatus = 200;
    const { id_user, id_course } = req.params;

    try {
        result = await userCourseDal.getUserCourseScore(id_user, id_course);

        if (!result) {
            res.status(404).send({
                message: 'Score not found',
            });
            return;
        }

        res.status(successStatus).send({
            message: 'Score retrieved successfully',
            scoreData: result
        });
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to retrieve score');
    }
};
