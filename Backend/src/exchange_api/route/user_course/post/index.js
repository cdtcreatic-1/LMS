const userCourseDal = require('cccommon/dal/user_course');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    try {
        const result = await userCourseDal.createUserCourse(req.body);
        res.status(201).send({
            message: 'User course created successfully',
            data: result
        });
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to create user course');
    }
};
