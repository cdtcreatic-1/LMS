const userCourseDal = require('cccommon/dal/user_course');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const { id_user, id_course } = req.params;
    try {
        const result = await userCourseDal.deleteUserCourse(id_user, id_course);
        res.status(200).send({
            message: 'User course deleted successfully'
        });
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to delete user course');
    }
};
