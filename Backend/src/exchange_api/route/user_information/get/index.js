// index.js

const commonConfig = require('cccommon/config');
const user4Dal = require('cccommon/dal/user_information');
const userDal = require('cccommon/dal/user');
const appErr = require('this_pkg/error');


exports.handler = async (req, res) => {
    const successStatus = 200;
    const id_user = Number(req.params.id_user);
    const id_user_information = Number(req.params.id_user_information);

    const valErrs = [];

    if (!id_user) {
        valErrs.push({ id_user: 'missing' });
    }

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    try {

        const userExists = await userDal.getUserByIdUser(id_user);
        if (!userExists) {
            appErr.send(req, res, 'user_not_found', 'User not found');
            return;
        }

        const user4Exists = await user4Dal.getUserInformationByIdUserInformation(id_user_information);

        if (!user4Exists) {
            appErr.send(req, res, 'user_not_found', 'User information not found');
            return;

        }

        res.status(successStatus).send({
            message: 'User Information retrieved successfully',
            user: user4Exists

        });
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to create user');
        return;
    }



};