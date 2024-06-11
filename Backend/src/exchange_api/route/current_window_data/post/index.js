const currentWindowsDal = require('cccommon/dal/current_windows');
const appErr = require('this_pkg/error');
const userDal = require('cccommon/dal/user');


exports.handler = async (req, res) => {
    const id_user = req.body.id_user;
    const current_window_id = req.body.current_window_id;
    const current_farm_number_lot = req.body.current_farm_number_lot;

    const successStatus = 200;
    const valErrs = [];
    let currentWindowData;

    if (!id_user) {
        valErrs.push({ id_user: 'missing' });
    }

    if (!current_window_id) {
        valErrs.push({ current_window_id: 'missing' });
    }

    if (current_farm_number_lot == undefined) {
        valErrs.push({ current_farm_number_lot: 'missing' });
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

        const currentWindowExists = await currentWindowsDal.getCurrentWindowsById(id_user);

        if (currentWindowExists[0]) {
            await currentWindowData.deleteCurrentWindowsByIdUser(id_user);
        }

        currentWindowData = await currentWindowsDal.createCurrentWindows(id_user, current_window_id, current_farm_number_lot);

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to create current window');
        return;
    }

    res.status(successStatus).send({
        message: 'Current Window created successfully',
        currentWindowData: currentWindowData
    });

};