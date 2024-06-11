const userCourseDal = require('cccommon/dal/user_course');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    let result = null;
    const successStatus = 200;
    const { id_user, id_course, certificate_description } = req.body;

    if (certificate_description === undefined) {
        appErr.send(req, res, 'validation_error', 'Missing certificate description');
        return;
    }

    try {
        result = await userCourseDal.updateUserCourseCertificate(id_user, id_course, certificate_description);
        res.status(successStatus).send({
            message: 'Certificate description updated successfully',
            data: result
        });
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to update certificate description');
    }
};
