const userDal = require('cccommon/dal/user');
const appErr = require('this_pkg/error');
const path = require('path');

exports.handler = async (req, res) => {
    let user_cover_photo = null;
    const id_user = req.body.id_user;

    if (req.files && req.files.user_cover_photo) {
        user_cover_photo = req.files.user_cover_photo[0];
    }

    const successStatus = 201;
    const valErrs = [];

    if (!id_user || isNaN(id_user) || Number(id_user) <= 0) {
        valErrs.push({ id_user: 'invalid' });
    }

    if (!user_cover_photo) {
        valErrs.push({ user_cover_photo: 'missing' });
    } else {
        const maxImageSize = 1 * 1024 * 1024; 
        const allowedImageTypes = ['.jpg', '.jpeg', '.png'];
        const imageExtension = path.extname(user_cover_photo.originalname).toLowerCase();

        if (!allowedImageTypes.includes(imageExtension)) {
            valErrs.push({ user_cover_photo: 'invalid format, must be png, jpg, jpeg' });
        }

        if (user_cover_photo.size > maxImageSize) {
            valErrs.push({ user_cover_photo: 'exceeds size limit of 1MB' });
        }
    }

    if (valErrs.length > 0) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    try {
        const userExists = await userDal.getUserByIdUser(id_user);
        if (!userExists) {
            appErr.send(req, res, 'not_found', 'User not found');
            return;
        }

        const updatedCoverPhoto = await userDal.updateUserCoverPhoto(id_user, user_cover_photo.path);
        res.status(successStatus).send({
            message: 'Cover photo updated successfully',
            cover_photo: updatedCoverPhoto
        });
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to update cover photo');
    }
};
