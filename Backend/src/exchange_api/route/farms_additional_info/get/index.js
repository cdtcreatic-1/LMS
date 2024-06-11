const farmAdditionalInfoDal = require('cccommon/dal/farms_additional_info');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
  const id_farm = Number(req.params.id_farm);

  if(!id_farm){
    appErr.send(req, res, 'validation_error', 'Missing id_farm');
    return;
  }

  try {
    const info = await farmAdditionalInfoDal.getFarmAdditionalInfoById(id_farm);
    
    if (!info) {
      appErr.send(req, res, 'not_found', 'Farm additional info not found');
      return;
    }
    
    res.status(200).send(info);
  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'Failed to fetch farm additional info');
  }
};
