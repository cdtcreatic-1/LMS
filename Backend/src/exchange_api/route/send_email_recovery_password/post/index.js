const appErr = require('this_pkg/error');
const userDal = require('cccommon/dal/user');
const { sendMailAsync } = require('cccommon/utils');
const ecUser = require('cccommon/user');
const { frontend_host, app_url } = require('cccommon/config');
const { passwordRecovery } = require('../../../../common/utils/emails');

exports.handler = async (req, res) => {
  const successStatus = 200;
  const email = req.body.email;

  try {
    const userExists = await userDal.getUserByEmail(email);

    if (!userExists) {
      appErr.send(req, res, 'user_not_found');
      return;
    }

    const userToken = ecUser.genTokenSync(userExists.id_user);
   
    await sendMailAsync('Recuperación de contraseña', passwordRecovery(userToken), email);

  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'failed to send email for recovery password');
    return;
  }

  res.status(successStatus).send({
    message: 'Email sent'
  });
};
