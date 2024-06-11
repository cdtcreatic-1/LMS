// post.js

const commonConfig = require('cccommon/config');
const user4Dal = require('cccommon/dal/user_information');
const userDal = require('cccommon/dal/user');
const userRoleDal = require('cccommon/dal/user_role');
const appErr = require('this_pkg/error');


exports.handler = async (req, res) => {
    let user_information;
    const successStatus = 201;
    const id_user = req.body.id_user;
    let id_type_of_information = 1;
    const user_personal_description_text = req.body.user_personal_description_text;
    const valErrs = [];

    if (!id_user) {
        valErrs.push({ id_user: 'missing' });
    }
    // Get user by id to check if it exists
    try {
        const userExists = await userRoleDal.getUserRole(id_user);
        if (!userExists) {
            appErr.send(req, res, 'user_not_found', 'User not found');
            return;
        }
        console.log("userExists ", userExists)
        //Check if user is a Empresario (id_role = 2)
        if (userExists.dataValues.id_role == 2) {
            id_type_of_information = req.body.id_type_of_information;

            if (!id_type_of_information || id_type_of_information == 1) {
                valErrs.push({ id_type_of_information: 'missing' });
            }

        }

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to get user ' + req.body.id_user);
        return;
    }


    if (!user_personal_description_text) {
        valErrs.push({ user_personal_description_text: 'missing' });
    }

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    try {

        user_information = await user4Dal.createuser_information(id_user, id_type_of_information, user_personal_description_text);
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to create user');
        return;
    }

    res.status(successStatus).send({
        message: 'User Information created successfully',
        user: user_information

    });

};