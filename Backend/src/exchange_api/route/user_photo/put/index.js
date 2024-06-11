const userDal = require('cccommon/dal/user');
const appErr = require('this_pkg/error');
exports.handler = async (req, res) => {

    let profile_photo;
    let user_profile_photo = null;
    const id_user = req.body.id_user;

    if(req.files.user_profile_photo) {
        user_profile_photo = req.files.user_profile_photo[0].path;
    }

    const successStatus = 200;
    const valErrs = [];

    if (!id_user) {
        valErrs.push({ id_user: 'missing' });
    }

    if(!user_profile_photo)
    {
        valErrs.push({ user_profile_photo: 'missing' });
    }

    if (valErrs.length > 0) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }


    try {

        profile_photo = await userDal.updateUserProfilePhoto(id_user, user_profile_photo);

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to get user by email');
        return;
    }

    res.status(successStatus).send({
        message: 'Profile photo updated successfully',
        profile_photo: profile_photo
    })
};