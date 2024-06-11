const userCourseDal = require('cccommon/dal/user_course');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const { id_user, id_course } = req.body;
    try {
        const result = await userCourseDal.updateUserCourse(id_user, id_course, req.body);
        res.status(200).send({
            message: 'User course updated successfully',
            data: result
        });
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to update user course');
    }
};
