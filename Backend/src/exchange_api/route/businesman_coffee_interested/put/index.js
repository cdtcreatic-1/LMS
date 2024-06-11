const dal = require('cccommon/dal/businesmanCoffeeInterested');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
  const id_user = req.body.id_user;

  const valErrs = [];

  if (!id_user) {
    valErrs.push({ id_user: 'missing' });
  }

  if (valErrs.length) {
    appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
    return;
  }

  try {
    const data = await dal.updateBusinesmanCoffeeInterested(id_user, req.body);
    if (data[0] === 0) {
      appErr.send(req, res, 'not_found', 'data not found to update');
      return;
    }
    res.status(200).send({ message: 'Data successfully updated' });
  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'failed to update data');
  }
};