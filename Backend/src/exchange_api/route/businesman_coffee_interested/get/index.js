const businessmanCIdal = require('cccommon/dal/businesmanCoffeeInterested');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
  const id_user = Number(req.params.id_user);
  
  if (!id_user) {
    appErr.send(req, res, 'validation_error', 'id_user missing');
    return;
  }

  try {
    const data = await businessmanCIdal.getBusinesmanCoffeeInterested(id_user);
    if (!data) {
      appErr.send(req, res, 'not_found', 'data not found');
      return;
    }
    res.status(200).send(data);
  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'failed to get data');
  }
};
