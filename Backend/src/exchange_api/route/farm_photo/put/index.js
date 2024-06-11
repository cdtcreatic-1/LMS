const commonConfig = require('cccommon/config');
const farmPhotosDal = require('cccommon/dal/farm_photos');
const farmsDal = require('cccommon/dal/farms');
const { deleteFile } = require('cccommon/file_utils')
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {

    let farms;
    let farmPhotos;
    let farm_photo_1 = null;
    let farm_photo_2 = null;
    let farm_photo_3 = null;
    const successStatus = 201;

    const id_farm = req.body.id_farm;

    if (req.files.farm_photo_1) {
        farm_photo_1 = req.files.farm_photo_1[0].path;
    }

    if (req.files.farm_photo_2) {
        farm_photo_2 = req.files.farm_photo_2[0].path;
    }

    if (req.files.farm_photo_3) {
        farm_photo_3 = req.files.farm_photo_3[0].path;
    }

    const valErrs = [];

    if (!id_farm) {
        valErrs.push({ id_farm: 'missing' });
    }

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    try {

        const farmExists = await farmsDal.getFarmsByIdFarm(id_farm);
        if (!farmExists) {
            appErr.send(req, res, 'farm_not_found', 'Farm not found');
            return;
        }

        const farmPhotosExists = await farmPhotosDal.getFarmPhoto(id_farm);

        if (!farmPhotosExists) {
            appErr.send(req, res, 'not_found', 'Farm Photos not found');
            return;
        }

        //Edit farm photos
        if (farmPhotosExists.dataValues.farm_photo_1) {
            await Promise.all([
                deleteFile(farmPhotosExists.dataValues.farm_photo_1)
            ]);
        }

        if (farmPhotosExists.dataValues.farm_photo_1) {
            await Promise.all([
                deleteFile(farmPhotosExists.dataValues.farm_photo_2)
            ]);
        }

        if (farmPhotosExists.dataValues.farm_photo_1) {
            await Promise.all([
                deleteFile(farmPhotosExists.dataValues.farm_photo_3)
            ]);
        }

        farmPhotos = await farmPhotosDal.updateFarmPhoto({ id_farm, farm_photo_1, farm_photo_2, farm_photo_3 });
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to create farm');
        return;
    }

    res.status(successStatus).send({
        message: 'Farm Photos created successfully',
        farmPhotos: farmPhotos
    });



};