// post.js

const commonConfig = require('cccommon/config');
const user4Dal = require('cccommon/dal/user_information');
const userDal = require('cccommon/dal/user');
const appErr = require('this_pkg/error');
const { deleteFile } = require('cccommon/file_utils')

exports.handler = async (req, res) => {
    let user_information;
    const successStatus = 201;


    const id_user = req.body.id_user;
    let id_type_of_information = req.body.id_type_of_information;
    const user_personal_description_text = req.body.user_personal_description_text;
    const id_user_information = req.body.id_user_information;

    const valErrs = [];

    if (!id_user) {
        valErrs.push({ id_user: 'missing' });
    }

    const usersDescriptionRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜ.,\-_\/;: ]{20,500}$/;
    if (!usersDescriptionRegex.test(user_personal_description_text)) {
        valErrs.push({ user_personal_description_text: 'Nombre inválido. Debe contener letras, tildes,Signos de puntuación básicos como la coma (,), el punto (.), el guion (-), el guion bajo (_), la barra (/), el punto y coma (;), el dos puntos (:)' });
    }
    // Get user by id to check if it exists
    try {
        const userExists = await userDal.getUserByIdUser(id_user);

        if (!userExists) {
            appErr.send(req, res, 'user_not_found', 'User not found');
            return;
        }
        console.log(userExists)
        //Check if user is a Empresario (id_role = 2)
        if (userExists.id_role == 2) {
            id_type_of_information = req.body.id_type_of_information;

            if (!id_type_of_information) {
                valErrs.push({ id_type_of_information: 'missing' });
            }
        }

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to get user');
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

        const user4Exists = await user4Dal.getUserInformationByIdUserInformation(id_user_information);

        console.log(user4Exists);

        if (!user4Exists) {
            appErr.send(req, res, 'user_not_found', 'User information not found');
            return;
        }

        user_information = await user4Dal.updateuser_information(id_user, id_type_of_information, user_personal_description_text, id_user_information);
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to create user');
        return;
    }

    res.status(successStatus).send({
        message: 'User Information created successfully',
        user: user_information

    });

};