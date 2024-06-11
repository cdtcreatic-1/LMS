const userCourseDal = require('cccommon/dal/user_course');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const { id_course } = req.params;
    try {
        const result = await userCourseDal.getCourseUsers(id_course);
        if (!result) {
            return res.status(404).send({ message: 'Users for course not found' });
        }
        res.status(200).send({
            message: 'Users for course retrieved successfully',
            data: result
        });
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to retrieve users for course');
    }
};
