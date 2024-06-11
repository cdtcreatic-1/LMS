const currentWindowsDal = require('cccommon/dal/current_windows');
const farmDal = require('cccommon/dal/farms');
const appErr = require('this_pkg/error');
const userDal = require('cccommon/dal/user');
const UserDocumentationDal = require('cccommon/dal/user_documentation');
const user4Dal = require('cccommon/dal/user_information');
const farmPhotosDal = require('cccommon/dal/farm_photos');


exports.handler = async (req, res) => {

    // get id_user from params
    const id_user = Number(req.params.id_user);
    const current_window_id = Number(req.params.current_window_id);
    const id_farm = Number(req.params.id_farm);

    const successStatus = 200;
    const valErrs = [];

    let currentWindowData = null;

    if (!id_user) {
        valErrs.push({ id_user: 'missing' });
    }

    if (!current_window_id) {
        valErrs.push({ current_window_id: 'missing' });
    }

    if (id_farm == undefined) {
        valErrs.push({ id_farm: 'missing' });
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
        const farmExists = await farmDal.getFarmsByIdFarm(id_farm);
        if (!farmExists) {
            appErr.send(req, res, 'farm_not_found', 'Farm not found');
            return;
        }
        switch (parseInt(current_window_id)) {
            case 10:
                if (userExists.dataValues.id_role == 2) {
            
                    const tempValues = {};

                    tempValues.id_user = userExists.dataValues.id_user;

                    tempValues.id_user = userExists.dataValues.id_user;
                    tempValues.user_name = userExists.dataValues.user_name;
                    tempValues.user_email = userExists.dataValues.user_email;
                    tempValues.user_gender = userExists.dataValues.user_gender;
                    tempValues.user_phone = userExists.dataValues.user_phone;
                    tempValues.user_username = userExists.dataValues.user_username;
                    tempValues.user_profile_photo = userExists.dataValues.user_profile_photo ? userExists.dataValues.user_profile_photo.replace('uploads/', '') : null;
                    tempValues.user_cover_photo = userExists.dataValues.user_cover_photo ? userExists.dataValues.user_cover_photo.replace('uploads/', '') : null;
                    tempValues.id_type_document = userExists.dataValues.id_type_document;
                    tempValues.number_document = userExists.dataValues.number_document;
                    tempValues.id_role = userExists.dataValues.id_role;


                    currentWindowData = tempValues;
                }

            case 12:
                //Farm data
                if (userExists.dataValues.id_role == 1) {
                    currentWindowData = await farmDal.getFarmsByIdUser(id_user);
                }
                break;
            case 13:
                //Legal representative data
                if (userExists.dataValues.id_role == 1) {
                    currentWindowData = await UserDocumentationDal.getUserDocumentationById(id_user);
                }
                break;
            case 20:
                //Audio and text data
                if (userExists.dataValues.id_role == 1) {
                    currentWindowData = await user4Dal.getUser4ById(id_user);
                } 

                break;
            case 30:
                if (userExists.dataValues.id_role == 2) {
                    currentWindowData = await user4Dal.getUser4ByIdUserAndIdTypeOfInformation(id_user, 2);
                }
                break;
            case 31:
                if (userExists.dataValues.id_role == 2) {
                    currentWindowData = await user4Dal.getUser4ByIdUserAndIdTypeOfInformation(id_user, 3);
                }
                break;
            case 32:
                if (userExists.dataValues.id_role == 2) {
                    currentWindowData = await user4Dal.getUser4ByIdUserAndIdTypeOfInformation(id_user, 4);
                }
                break;
            case 33:
                if (userExists.dataValues.id_role == 2) {
                    currentWindowData = await user4Dal.getUser4ByIdUserAndIdTypeOfInformation(id_user, 5);
                }
                break;

            case 40:
                // Farm documentation
                if (userExists.dataValues.id_role == 1) {
                    currentWindowData = await farmDal.getFarmsByIdUser(id_user);
                }
                break;
            case 42:
                // Farm photos
                if (userExists.dataValues.id_role == 1) {
                    currentWindowData = await farmPhotosDal.getFarmPhoto(id_farm);
                }
                break;
            default:
                break;
        }

        if (!currentWindowData) {
            appErr.send(req, res, 'user_not_found', 'User information not found');
            return;

        }

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to retrieve current window');
        return;
    }

    res.status(successStatus).send({
        message: 'Current Window retrieved successfully',
        currentWindowData: currentWindowData
    });
};