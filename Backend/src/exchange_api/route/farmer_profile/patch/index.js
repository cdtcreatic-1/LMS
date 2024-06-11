const farmerDal = require('cccommon/dal/farmer');
const appErr = require('this_pkg/error');

exports.handler = async(req, res) => {

    const { id_user, user_name, user_phone, user_email, user_username } = req.body;
    
    const valErrs = [];

    if (!id_user) {
        valErrs.push({ id_user: 'missing' });
    }

    if (!user_name) {
        valErrs.push({ user_name: 'missing' });
    }

    if (!user_phone) {
        valErrs.push({ user_phone: 'missing' });
    }

    if (!user_email) {
        valErrs.push({ user_email: 'missing' });
    }

    if (!user_username) {
        valErrs.push({ user_username: 'missing' });
    }

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    try {
        
        const farmerUpdated = await farmerDal.updateUserFamerDataById({
            id_user,
            user_name,
            user_phone,
            user_email,
            user_username
        });

        const response = {
            user_name: farmerUpdated[1].user_name,
            user_phone: farmerUpdated[1].user_phone,
            user_email: farmerUpdated[1].user_email,
            user_username: farmerUpdated[1].user_username
        };

        res.status(200).json({
            message: 'User updated successfully',
            farmerUpdated: response
        });
    } catch(error) {
        appErr.handleRouteServerErr(req, res, error, 'failed to update farmer data');
    }
};
