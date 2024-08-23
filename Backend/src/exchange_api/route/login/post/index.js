const userDal = require('cccommon/dal/user');
const appErr = require('this_pkg/error');
const loginAttemptsDal = require('cccommon/dal/login_attempts');
const { sendMailAsync } = require('cccommon/utils');
const {frontend_host, app_url} = require('cccommon/config');

exports.handler = async (req, res) => {
    const {user_email, user_password} = req.body;
    const successStatus = 200;
    const valErrs = [];
    let user;

    if (!user_email) {
        valErrs.push({ user_email: 'missing' });
    }

    if (!user_password) {
        valErrs.push({ user_password: 'missing' });
    }

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    const emailRegex = /^[a-zA-Z0-9._@-]{6,50}$/;
    if (!emailRegex.test(user_email)) {
        valErrs.push({ user_email: 'Invalid email. It should have a valid email format and a maximum of 50 characters.' });
    }
    
    const passwordRegex = /^\d{8,50}$/;
    if (!passwordRegex.test(user_password)) {
        valErrs.push({ user_password: 'Invalid password must contain 8 to 50 characters.' });
    }

    try {

        user = await userDal.getUserByEmail(user_email);
        
        if (!user) {
            appErr.send(req, res, 'not_found', 'User not found');
            return;
        }
        if (!user.user_enabled) {
            appErr.send(req, res, 'unauthorized user', 'User account not enabled. Please verify your email.');
            return;
        }
        const attempts = await loginAttemptsDal.getAttemptsByUserId(user.id_user);
        if (attempts.failed_attempts >= 5) {
            const timeDiff = (new Date() - new Date(attempts.last_failed_attempt)) / (1000 * 60);
            if (timeDiff < 30) {
                const emailSubject = "Cuenta Bloqueada Temporalmente";
                const emailBody = "Se ha bloqueado por 30 minutos la cuenta debido a exceso de intentos fallidos.";
                await sendMailAsync(emailSubject, emailBody, user.user_email);
                appErr.send(req, res, 'forbidden', 'Too many failed attempts. Please try again later.');
                return;
            } else {
                await loginAttemptsDal.resetFailedAttempts(user.id_user);
            }
        }

        const passwordMatch = userDal.comparePasswordSync(user_password, user.user_password);
        if (!passwordMatch) {
            await loginAttemptsDal.incrementFailedAttempts(user.id_user);
            appErr.send(req, res, 'not_found', 'User not found');
            return;
        } else {
            await loginAttemptsDal.resetFailedAttempts(user.id_user); 
        }


    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to get user by email');
        return;
    }

    // Send just enough for debugging & logged-in status/identity in UIs.
    /*if(user.id_role == 4)
    {
        const body_text  = `Dale click al siguiente enlace para iniciar sesión: ${frontend_host()}/admin/auth/${user.id_user}/${user.user_token}`
        res.status(successStatus).send({
            id_user: user.id_user,
            login_status: 'pending'
        });
    } else {*/
        res.status(successStatus).send({
            id_user: user.id_user,
            user_email: user.user_email,
            user_name: user.user_name,
            user_phone: user.user_phone,
            user_token: user.user_token,
            id_role: user.id_role,
            login_status: 'success' 
        })
    //}
};


        



