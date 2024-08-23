const commonConfig = require('cccommon/config');
const farmDal = require('cccommon/dal/farms');
const userDal = require('cccommon/dal/user');
const appErr = require('this_pkg/error');


exports.handler = async (req, res) => {
    let farmSaved;
    const successStatus = 201;

    const id_user = req.body.id_user;
    const farm_name = req.body.farm_name;
    const farm_number_lots = req.body.farm_number_lots;
    const id_village = req.body.id_village;
    const farm_longitude = req.body.farm_longitude;
    const farm_latitude = req.body.farm_latitude;
    const name_provided_by_user = req.body.name_provided_by_user || "";

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

    if (farm_number_lots < 1) {
        valErrs.push({ farm_number_lots: 'lots quantity must be greater than or equal to 1' });
    }

    if (!id_village && (!farm_longitude || !farm_latitude)) {
        valErrs.push({ id_village: 'missing', farm_longitude: 'missing', farm_latitude: 'missing' });
    }

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    const farmnameRegex =  /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ.,\s]{3,50}$/;
    if (!farmnameRegex.test(farm_name)) {   
        valErrs.push({ farm_name: 'Invalid property name. Must text, allows numbers, special characters and accents (.)'});
    } 
    
    const lotRegex =  /^\d{1,10}$/;
    if (!lotRegex.test(farm_number_lots)) {   
        valErrs.push({ farm_number_lots: 'Invalid Lot Number, allows numbers'});
    }

    try {

        const userExists = await userDal.getUserByIdUser(id_user);
        if (!userExists) {
            appErr.send(req, res, 'user_not_found', 'User not found');
            return;
        }

        farmSaved = await farmDal.createFarm({ id_user, farm_name, farm_number_lots, id_village, farm_longitude, farm_latitude, name_provided_by_user });
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to create Farm');
        return;
    }

    res.status(successStatus).send({
        message: 'User created successfully',
        farmSaved: farmSaved
    });

};