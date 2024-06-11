const businessmanCIdal = require('cccommon/dal/businesmanCoffeeInterested');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
  const successStatus = 201;

  const {
    id_user,
    id_profile,
    id_roast,
    id_city
  } = req.body;

  const valErrs = [];

  const requiredFields = ['id_user', 'id_profile', 'id_roast', 'id_city'];
  requiredFields.forEach(field => {
    if (!req.body[field]) {
      valErrs.push({ [field]: 'missing' });
    }
  });

  if (valErrs.length) {
    appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
    return;
  }

  try {
    const data = await businessmanCIdal.saveBusinesmanCoffeeInterested({id_user, id_profile, id_roast, id_city});
    res.status(successStatus).send({ message: 'Data successfully saved', data: data });
  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'failed to save data');
  }
};
