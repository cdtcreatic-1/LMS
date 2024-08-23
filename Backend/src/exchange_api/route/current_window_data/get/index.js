const currentWindowsDal = require('cccommon/dal/current_windows');
const farmDal = require('cccommon/dal/farms');
const appErr = require('this_pkg/error');
const userDal = require('cccommon/dal/user');



exports.handler = async (req, res) => {

    // get id_user from params
    const id_user = Number(req.params.id_user);

    const successStatus = 200;
    const valErrs = [];

    if (!id_user) {
        valErrs.push({ id_user: 'missing' });
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

        const currentWindowData = await currentWindowsDal.getCurrentWindowsById(id_user);
        const farmData = await farmDal.getFarmsByIdUser(id_user);
        if (!currentWindowData[0]) {
            res.status(successStatus).send({
                message: 'Current Window retrieved successfully',
                currentWindowData: [
                    {
                        id_user: id_user,
                        current_window_id: 0,
                        current_farm_number_lot: 0,
                        id_farm: farmData[0] ? farmData[0].id_farm : 0
                    }
                ]
            });
            return;
        }

        res.status(successStatus).send({
            message: 'Current Window retrieved successfully',
            current_window_id: currentWindowData[0].current_window_id,
            current_farm_number_lot: currentWindowData[0].current_farm_number_lot,
            id_farm: farmData[0] ? farmData[0].id_farm : 0,
            farm_number_lots: farmData[0] ? farmData[0].farm_number_lots : 0
        });

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to retrieve current window');
        return;
    }
};