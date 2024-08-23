const commonConfig = require('cccommon/config');
const userDal = require('cccommon/dal/user');
const userRoleDal = require('cccommon/dal/user_role');
const userCreationDal = require('cccommon/dal/user_creation');

const appErr = require('this_pkg/error');

const fs = require('fs').promises;
const path = require('path');
const { sendMailAsync } = require('../../../../common/utils/');
const { registerMail } = require('../../../../common/utils/emails');
const gm = require('gm').subClass({ imageMagick: true });


async function convertImageToBase64(path) {
    try {
        const bitmap = await fs.readFile(path);
        return Buffer.from(bitmap).toString('base64');
    } catch (err) {
        throw err;
    }
}



function generateImageWithText(imagePath, textToOverlay, outputPath) {


    const fontSize = 36
    const textColor = '#000000';
    const xPosition = 30;
    const yPosition = 360;

    return new Promise((resolve, reject) => {
        gm(imagePath)
            .fontSize(fontSize)
            .fill(textColor)
            .drawText(xPosition, yPosition, textToOverlay)
            .write(outputPath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Imagen con texto superpuesto creada con éxito.');
                    resolve(outputPath);
                }
            });
    });
}


exports.handler = async (req, res) => {
    let user;
    let user_creation;
    let user_role;

    const successStatus = 201;

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
        register_from_google
    } = req.body;

    let { user_enabled } = req.body;

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

    let requiredFields = ['user_name', 'user_phone', 'user_email', 'id_user_gender', 'user_username', 'user_password', 'user_confirm_password', 'id_type_document', 'number_document', 'id_role'];
    if (req.body.id_role == 2 || req.body.id_role == 4) {
        requiredFields.push('postal_code', 'id_state');
    }
    requiredFields.forEach(field => {
        if (!req.body[field]) {
            valErrs.push({ [field]: 'missing' });
        }
    });

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    const maxImageSize = 3 * 1024 * 1024;
    if (req.files && req.files.user_profile_photo && req.files.user_profile_photo[0].size > maxImageSize) {
        valErrs.push({ user_profile_photo: 'image size should not exceed 3 MB' });
    }
    
    //user_name only letters and spaces  and minimun 3 characters and max 50 characters and avoid spaces at the beginning and end
    const nameRegex = /^[\p{L}\sáéíóúüñÁÉÍÓÚÜÑ]{6,50}$/u;
    if (!nameRegex.test(user_name)) {
        valErrs.push({ user_name: 'Nombre inválido. Debe contener solo letras, espacios y caracteres especiales (como "ñ" o tíldes), tener entre 6 y 50 caracteres, y no debe comenzar ni terminar con espacios.' });
    }

    // user_phone: only numbers and maximum 10 digits
    const phoneRegex = /^\d{8,15}$/;
    if (!phoneRegex.test(user_phone)) {
        valErrs.push({ user_phone: 'Invalid phone number. It should contain only numbers and have between 8 and 15 digits.' });
    }

    // user_email: should have an email format and a maximum of 50 characters
    const emailRegex = /^[a-zA-Z0-9._@-]{6,50}$/;
    if (!emailRegex.test(user_email)) {
        valErrs.push({ user_email: 'Invalid email. It should have a valid email format and a maximum of 50 characters.' });
    }

    // user_username: only letters and numbers and spaces and minimun 6 characters and max 90 characters
    const usernameRegex = /^[a-zA-Z0-9]{6,50}$/;
    if (!usernameRegex.test(user_username)) {
        valErrs.push({ user_username: 'Nombre de usuario inválido. Debe contener solo letras, números y debe tener entre 6 y 50 caracteres.' });
    }

    // number_document: only numbers and between 8 and 11 digits
    const numberDocumentRegex = /^\d{8,11}$/;
    if (!numberDocumentRegex.test(number_document)) {
        valErrs.push({ number_document: 'Invalid document number. It should contain only numbers and have between 8 and 11 digits.' });
    }

    if (id_role == 2) {
        // postal_code: only numbers and length between 3 and 10 digits
        const postalCodeRegex = /^\d{6,10}$/;
        if (!postalCodeRegex.test(postal_code)) {
            valErrs.push({ postal_code: 'Invalid postal code. It should contain only numbers.' });
        }

        if (postal_code.length < 2 || postal_code.length > 10) {
            valErrs.push({ postal_code: 'Invalid postal code length. It should have between 2 and 10 digits.' });
        }
    }
    // user_password: maximum 16 characters and minimum 8 characters
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d^&])[^\s^&]{8,18}$/;
    if (!passwordRegex.test(user_password)) {
        valErrs.push({ user_password: 'Contraseña inválida. Debe tener entre 8 y 16 caracteres, contener al menos una letra mayúscula, un número y un carácter especial.' });
    }

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    if (user_password !== user_confirm_password) {
        appErr.send(req, res, 'passwords_not_match', 'Passwords do not match');
        return;
    }

    try {
        let userRole;
        if (id_user_created_by) {
            userRole = await userRoleDal.getIdRoleByIdUser(id_user_created_by);
            if (userRole?.dataValues.id_role != 4) {
                appErr.send(req, res, 'user_not_admin', 'User not admin');
                return;
            }
        }
        console.log({ user_email })
        const userExists = await userDal.getUserByEmail(user_email);

        if (userExists) {
            appErr.send(req, res, 'user_exist', 'User already exists');
            return;
        }

        const userExistsByUsername = await userDal.getUserByUserUserName(user_username);
        if (userExistsByUsername) {
            appErr.send(req, res, 'user_exist', 'User already exists');
            return;
        }

        const existingUserByDocument = await userDal.getUserByDocumentNumber(number_document);
        if (existingUserByDocument) {
            appErr.send(req, res, 'user_exist_document', 'A user with this document number already exists');
            return;
        }
        if (register_from_google) {
            user_enabled = true;
        }

        user = await userDal.createUser({ user_name, user_phone, user_email, id_user_gender, user_username, user_password, user_profile_photo, id_type_document, number_document, postal_code, id_state, user_enabled: userRole?.dataValues.id_role == 4 ? user_enabled : false, id_role });

        if (!id_user_created_by && !register_from_google) {

            await sendMailAsync('Verificación de correo', registerMail({ name: user.user_name, token: user.user_token }), user_email);

        }

        user_creation = userCreationDal.createUserCreation({ id_user: user.id_user, id_user_created_by: id_user_created_by ? id_user_created_by : user.id_user });

        user_role = await userRoleDal.addNewUserRole(user.id_user, id_role);


    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to create user');
        return;
    }

    res.status(successStatus).send({
        id_user: user.id_user,
        token: user.user_token,
        fex_version: commonConfig.logging.build_info()
    });
};
