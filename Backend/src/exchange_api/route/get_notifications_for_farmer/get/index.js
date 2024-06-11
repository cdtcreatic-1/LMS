const purchaseDal = require('cccommon/dal/purchase')
const userDal = require('cccommon/dal/user');
const appErr = require('this_pkg/error');
const {frontend_host, app_url} = require('cccommon/config');

exports.handler = async (req, res) => {
    console.log('get_notifications_for_farmer handler called');
    const id_seller = Number(req.params.id_seller);

    let purchaseData;
    const successStatus = 200;

    if (!id_seller) {
        appErr.send(req, res, 'validation_error', 'missing id_seller');
        return;
    }

    try {
        const userExists = await userDal.getUserByIdUser(id_seller);
        if (!userExists) {
            appErr.send(req, res, 'not_found', 'User not found');
            return;
        }

        purchaseData = await purchaseDal.getPurchaseByIdSellerInProccess(id_seller);
        for(let indexPurchase in purchaseData){
            if(purchaseData[indexPurchase].dataValues?.Buyer.dataValues?.user_profile_photo){
                purchaseData[indexPurchase].dataValues.Buyer.dataValues.user_profile_photo = app_url() + purchaseData[indexPurchase].dataValues.Buyer.dataValues.user_profile_photo;
            }
        }
        res.status(successStatus).send({
            message: 'purchase retrieved successfully',
            purchaseData: purchaseData
        });

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to get purchase');
        return;
    }
}
