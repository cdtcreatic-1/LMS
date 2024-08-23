const userCourseDal = require('cccommon/dal/user_course');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const { id_user, id_course } = req.params;
    try {
        const result = await userCourseDal.getUserCourse(id_user, id_course);
        if (!result) {
            return res.status(404).send({ message: 'User course not found' });
        }
        res.status(200).send({
            message: 'User course retrieved successfully',
            data: result
        });
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to retrieve user course');
    }
};
