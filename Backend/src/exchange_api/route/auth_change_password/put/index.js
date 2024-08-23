const userDal = require('cccommon/dal/user')
const appErr = require('this_pkg/error');
const { verifyToken }  = require('cccommon/user');

exports.handler = async (req, res) => {
    const successStatus = 200;
    const resFilter = req.rawHeaders.filter(
      (item) => !item.indexOf("Bearer")
    );
   
    const tokenReal = resFilter[0].slice(7,resFilter[0].length);
   
    const { new_password, confirm_password } = req.body;
   
    const valErrs = [];
   
    const requiredFields = ["new_password", "confirm_password"];
   
    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        valErrs.push({ [field]: "missing" });
      }
    });
   
    const passwordRegex = /^(?=.*[a-zñ])(?=.*[A-ZÑ])(?=.*\d)(?=.*[@+.*\-_/%#$,])[A-Za-zñÑ\d@+.*\-_/%#$,]{8,16}$/;
    if (!passwordRegex.test(new_password)) {
        const errorMsg = 'Criterios de contraseña inválidos. ' +
            'Debe contener al menos 1 letra minúscula, ' +
            '1 letra mayúscula, 1 número y 1 carácter especial. ' +
            'La longitud de la contraseña debe ser entre 8 y 16 caracteres.';
                
        valErrs.push({ new_password: errorMsg });
    }
    
   
    if (new_password !== confirm_password) {
      appErr.send(req, res, "validation_error", "passwords_do_not_match");
    }
   
    if (valErrs.length) {
      appErr.send(req, res, "validation_error", appErr.mergeValErrLists(valErrs));
      return;
    }
   
    try {
      const decoded = verifyToken(tokenReal);
      if (decoded && decoded.id_user) {
        userResult = await userDal.getUserByIdUser(decoded.id_user);
      } else {
        appErr.send(req, res, "invalid token", "Invalid token");
        return;
      }
   
      user = await userDal.updatePassword(userResult.id_user, new_password);
    } catch (err) {
      appErr.handleRouteServerErr(req, res, err, "Error updating user password");
    }
   
    res.status(successStatus).send({
      message: "User password updated successfully",
    });
  };