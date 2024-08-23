const purchaseDal = require('cccommon/dal/purchase')
const userDal = require('cccommon/dal/user');
const appErr = require('this_pkg/error');
const {frontend_host, app_url} = require('cccommon/config');

exports.handler = async (req, res) => {

    const id_user = Number(req.params.id_user);

    let purchaseData;
    const successStatus = 200;

    if (!id_user) {
        appErr.send(req, res, 'validation_error', 'missing id_user');
        return;
    }

    try {
        const userExists = await userDal.getUserByIdUser(id_user);
        if (!userExists) {
            appErr.send(req, res, 'not_found', 'User not found');
            return;
        }

        purchaseData = await purchaseDal.getPurchaseStatusByIdUser(id_user);

        res.status(successStatus).send({
            message: 'purchase retrieved successfully',
            purchaseData: purchaseData
        });

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to get purchase');
        return;
    }
}
