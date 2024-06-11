const farmAdditionalInfoDal = require('cccommon/dal/farms_additional_info');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
  try {
    const valErrs = [];
    const requiredFields = ['id_farm', 'altitude', 'climate', 'temperature'];
    requiredFields.forEach(field => {
    if (!req.body[field]) {
        valErrs.push({ [field]: 'missing' });
    }
    });

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }
    const newInfo = await farmAdditionalInfoDal.createFarmAdditionalInfo(req.body);
    res.status(201).send(newInfo);
  } catch (err) {
    appErr.handleRouteServerErr(req, res, err, 'Failed to create farm additional info');
  }
};
