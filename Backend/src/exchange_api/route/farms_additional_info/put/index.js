const farmAdditionalInfoDal = require('cccommon/dal/farms_additional_info');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
  const id_farm = Number(req.params.id_farm);
  const { altitude, climate, temperature } = req.body;

  if(!id_farm){
    appErr.send(req, res, 'validation_error', 'Missing id_farm');
    return;
  }

  try {
    const updatedInfo = await farmAdditionalInfoDal.updateFarmAdditionalInfo(id_farm, {
      altitude,
      climate,
      temperature
    });

    if (!updatedInfo) {
      appErr.send(req, res, 'not_found', 'Farm additional info not found');
      return;
    }

    res.status(200).send({ message: 'Farm additional info updated successfully' });
  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'Failed to update farm additional info');
  }
};
