const commonConfig = require('cccommon/config');
const userDal = require('cccommon/dal/user');
const userRoleDal = require('cccommon/dal/user_role');
const userCreationDal = require('cccommon/dal/user_creation');

const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    let user;
    let user_creation;
    let user_role;

    const successStatus = 200;

    const { 
        user_name,
        user_phone,
        user_email,
        id_user_gender,
        user_username,
        user_password,
        user_confirm_password,
        id_type_document,
        number_document,
        postal_code,
        id_state,
        id_role,
        id_user_created_by,
        user_enabled
    } = req.body;

    // let user_profile_photo = null;
    // if (req.files && req.files.user_profile_photo) {
    //     user_profile_photo = req.files.user_profile_photo[0].path;
    // }

    const allowedFormats = ['image/jpeg', 'image/png']; // Formatos permitidos
    const maxFileSize = 3 * 1024 * 1024; // Tamaño máximo permitido (3MB en bytes)

    let user_profile_photo = null;
    if (req.files && req.files.user_profile_photo) {
        const uploadedFile = req.files.user_profile_photo[0];
        // Validar el formato del archivo
        if (!allowedFormats.includes(uploadedFile.mimetype)) {
            return res.status(400).json({ error: 'Formato de archivo no permitido.' });
        }
        // Validar el tamaño del archivo
        if (uploadedFile.size > maxFileSize) {
            return res.status(400).json({ error: 'El tamaño del archivo excede el límite permitido.' });
        }
        user_profile_photo = uploadedFile.path;
    }


    const valErrs = [];

    let updateData = {};
    if (user_name) {
        updateData.user_name = user_name;
        const nameRegex = /^[\p{L}\sáéíóúüñÁÉÍÓÚÜÑ]{6,50}$/u;
        if (!nameRegex.test(user_name)) {
            valErrs.push({ user_name: 'Nombre inválido. Debe contener solo letras, espacios y caracteres especiales (como "ñ" o letras acentuadas), tener entre 10 y 40 caracteres, y no debe comenzar ni terminar con espacios.' });
        }        
    }

    // const maxImageSize = 3 * 1024 * 1024;
    // if (req.files && req.files.user_profile_photo && req.files.user_profile_photo[0].size > maxImageSize) {
    //     valErrs.push({ user_profile_photo: 'image size should not exceed 3 MB' });
    // }
    // const allowedFormats = ['image/jpg', 'image/png'];
    // if (!allowedFormats.includes(req.files && req.files.user_profile_photo && req.files.user_profile_photo[0].mimetype)) {
    //     valErrs.push({ user_profile_photo: 'image size should not exceed 1 MB' });
    // }

    if (user_phone) {
        updateData.user_phone = user_phone;
        const phoneRegex = /^\d{8,15}$/;
        if (!phoneRegex.test(user_phone)) {
            valErrs.push({ user_phone: 'Invalid phone. It should contain only numbers and have between 8 and 15 digits.' });
        }
    }

    if (number_document) {
        updateData.number_document = number_document;
        const numberDocumentRegex = /^\d{8,11}$/;
        if (!numberDocumentRegex.test(number_document)) {
            valErrs.push({ number_document: 'Invalid number document. It should contain only numbers and have between 8 and 11 digits.' });
        }
    }

    if (user_email) {
        updateData.user_email = user_email;
        const emailRegex = /^[a-zA-Z0-9._@-]{6,50}$/;
        if (!emailRegex.test(user_email)) {
            valErrs.push({ user_email: 'Invalid email. It should have a valid email format and a maximum of 50 characters.' });
        }
    }

    if (user_username) {
        updateData.user_username = user_username;
        const usernameRegex = /^[a-zA-Z0-9]{6,50}$/;
        if (!usernameRegex.test(user_username)) {
            valErrs.push({ user_username: 'Nombre de usuario inválido. Debe contener solo letras, números, espacios y caracteres especiales (como "ñ" o letras acentuadas), y tener entre 6 y 90 caracteres.' });
        }
    }
    if (postal_code) {
        updateData.postal_code = postal_code;
        const postalCodeRegex = /^\d{6,10}$/;
        if (!postalCodeRegex.test(postal_code)) {
            valErrs.push({ postal_code: 'Invalid postal code. It should contain only numbers.' });
            return;
        }
    
        if (postal_code.length < 2 || postal_code.length > 10) {
            valErrs.push({ postal_code: 'Invalid postal code length. It should have between 2 and 10 digits.' });
        }
    }    

    if (user_password) {
        updateData.user_password = user_password;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d^&])[^\s^&]{8,18}$/;
        if (!passwordRegex.test(user_password)) {
            valErrs.push({ user_password: 'Invalid password. It should be between 8 and 16 characters long, contain at least one uppercase letter, one number, and one special character.' });
        }
        if (user_password !== user_confirm_password) {
            valErrs.push({ user_confirm_password: 'Passwords do not match' });
            return;
        }
    }

    if(valErrs.length){
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    if (id_user_gender) updateData.id_user_gender = id_user_gender;
    if (id_type_document) updateData.id_type_document = id_type_document;
    if (id_state) updateData.id_state = id_state;
    if (user_profile_photo) updateData.user_profile_photo = user_profile_photo;
    if (id_user_created_by) updateData.id_user_created_by = id_user_created_by;
    if (user_enabled) updateData.user_enabled = user_enabled;
    updateData.users_updated_at = new Date();


    try {
        let userRole;
        if (id_user_created_by) {
            userRole = await userRoleDal.getIdRoleByIdUser(id_user_created_by);
            if (userRole?.dataValues.id_role != 4) {
                appErr.send(req, res, 'user_not_admin', 'User not admin');
                return;
            }
        }

        const userExists = await userDal.getUserByEmail(user_email);
        if (!userExists) {
            appErr.send(req, res, 'user_not_exist', 'User does not exist');
            return;
        }

        user = await userDal.updateUser(updateData);
        
        user_creation = await userCreationDal.updateUserCreation({ id_user: user.id_user, id_user_created_by: id_user_created_by ? id_user_created_by : userExists.id_user });

        user_role = await userRoleDal.updateUserRole(user.id_user, id_role);

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to update user');
        return;
    }

    res.status(successStatus).send({
        id_user: user.id_user,
        token: user.user_token,
        fex_version: commonConfig.logging.build_info()
    });
};
