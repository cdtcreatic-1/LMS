const userCourseDal = require('cccommon/dal/user_course');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    let result = null;
    const successStatus = 200;
    const { id_user, id_course, score } = req.body;

    if (score === undefined) {
        appErr.send(req, res, 'validation_error', 'Missing score');
        return;
    }

    try {
        result = await userCourseDal.updateUserCourseScore(id_user, id_course, score);
        res.status(successStatus).send({
            message: 'Score updated successfully',
            data: result
        });
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to update score');
    }
};
