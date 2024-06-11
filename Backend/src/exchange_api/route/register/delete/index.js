const Commonconfig  = require('cccommon/config');
const userDal = require('cccommon/dal/user');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
  let user;

  const successStatus = 201;
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;
  const valErrs = [];

  if (!username) {
    valErrs.push({email: 'missing'});
  }
  if (!password) {
    valErrs.push({password: 'missing'});
  }

  if (valErrs.length) {
    appErr.send(req, res, 'input_validation_failed', appErr.mergeValErrList(valErrs));
    return;
  }

  try {
    user = await userDal.findByCred(username, password);

  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, Logging, 'failed to query for user');
    return;
  }

  if (!user) {
    appErr.send(req, res, 'unauthorized');
    return;
  }
  

  if (!user.token) {
    try {
      await userDal.genToken(user);
    } catch (err) {
      appErr.handleRouteServerErr(req, res, err, Logging, 'failed to update/generate user token');
      return;
    }
  }

  res.status(successStatus).send({
      token: user.token,
      gva_version: Commonconfig.logging.build_info()
  });
};
