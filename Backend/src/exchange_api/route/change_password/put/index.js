const userDal = require('cccommon/dal/user')
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {

    const successStatus = 200;
    let user;
    const { id_user, old_password, new_password, confirm_password } = req.body;


    const valErrs = [];

    const requiredFields = ['id_user', 'old_password', 'new_password', 'confirm_password'];

    requiredFields.forEach(field => {
        if (!req.body[field]) {
            valErrs.push({ [field]: 'missing' });
        }
    });

    const passwordRegex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%*()-+_=?{}[\];':"\\|,.<>\/])(?!.*[&^]).{8,18}$/;
    if (!passwordRegex.test(new_password)) {
      const errorMsg =
        "Criterios de contraseña inválidos. " +
        "Debe contener al menos 1 letra minúscula, " +
        "1 letra mayúscula, 1 número y 1 carácter especial. " +
        "La longitud de la contraseña debe ser entre 8 y 16 caracteres.";
    
      valErrs.push({ new_password: errorMsg });
    }
    
    if (new_password !== confirm_password) {
        appErr.send(req, res, 'validation_error', 'passwords_do_not_match');
    }

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }
    
    try {
        const userExist = await userDal.getUserByIdUser(id_user);

        if (!userExist) {
            appErr.send(req, res, 'validation_error', 'user_does_not_exist');
        }

        // Compara la contraseña ingresada con la contraseña del usuario
        const passwordMatch = userDal.comparePasswordSync(old_password, userExist.user_password);

        if (!passwordMatch) {
            appErr.send(req, res, 'validation_error', 'La contraseña actual, es incorrecta');
            return;
        }

        user = await userDal.updatePassword(id_user, new_password);


    } catch (err) {

        appErr.handleRouteServerErr(req, res, err, 'Error updating user password');

    }

    res.status(successStatus).send({
        message: 'User password updated successfully',
        user: user
    });

};