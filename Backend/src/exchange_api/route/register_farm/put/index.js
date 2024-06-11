const commonConfig = require('cccommon/config');
const farmDal = require('cccommon/dal/farms');
const userDal = require('cccommon/dal/user');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    let farmUpdated;
    const successStatus = 201;

    const id_user = req.body.id_user;
    const farm_name = req.body.farm_name;
    const farm_number_lots = req.body.farm_number_lots;
    const id_village = req.body.id_village;
    const farm_longitude = req.body.farm_longitude;
    const farm_latitude = req.body.farm_latitude;

    const valErrs = [];

    if (!id_user) {
        valErrs.push({ id_user: 'missing' });
    }

    if (!farm_name) {
        valErrs.push({ farm_name: 'missing' });
    }

    if (!farm_number_lots) {
        valErrs.push({ farm_number_lots: 'missing' });
    }

    if (!id_village) {
        valErrs.push({ id_village: 'missing' });
    }

    if (!farm_longitude) {
        valErrs.push({ farm_longitude: 'missing' });
    }

    if (!farm_latitude) {
        valErrs.push({ farm_latitude: 'missing' });
    }

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    try {
        const userExists = await userDal.getUserByIdUser(id_user);
        if (!userExists) {
            appErr.send(req, res, 'user_not_found', 'User not found');
            return;
        }

        const farmExists = await farmDal.getFarmsByIdUser(id_user);
        if (!farmExists || !farmExists[0]) {
            appErr.send(req, res, 'farm_not_found', 'Farm not found');
            return;
        }

        const id_farm = farmExists[0].dataValues.id_farm;
        const farm_updated_at = Date.now();

        farmUpdated = await farmDal.updateFarm({id_farm, id_user, farm_name, farm_number_lots, id_village, farm_longitude, farm_latitude, farm_updated_at});

        if (!farmUpdated) {
            appErr.send(req, res, 'farm_not_updated', 'Farm could not be updated');
            return;
        }

        res.status(successStatus).send({
            message: 'Farm updated successfully',
            farmSaved: farmUpdated
        });
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to update Farm');
        return;
    }
};
