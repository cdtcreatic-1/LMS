const purchaseDal = require('cccommon/dal/purchase')
const appErr = require('this_pkg/error');
const {frontend_host, app_url} = require('cccommon/config');

exports.handler = async (req, res) => {
    const id_purchase = Number(req.params.id_purchase);
    if(!id_purchase){
        appErr.send(req, res, 'validation_error', 'Missing id_purchase');
        return;
      }

    let purchaseData;
    const successStatus = 200;

    try {

        purchaseData = await purchaseDal.getPurchaseByIdPurchase(id_purchase);

        let purchaseJson
        if(purchaseData){
            purchaseJson = purchaseData.toJSON();
            if(purchaseJson.Lot.LotPhoto)
            {
                purchaseJson.Lot.LotPhoto.lot_photo =  purchaseJson.Lot.LotPhoto.lot_photo ? app_url() + purchaseJson.Lot.LotPhoto.lot_photo : null;
            }
            purchaseJson.Buyer.user_profile_photo = purchaseJson.Buyer.user_profile_photo ? app_url() + purchaseJson.Buyer.user_profile_photo : null;
            purchaseJson.Seller.user_profile_photo = purchaseJson.Seller.user_profile_photo ? app_url() + purchaseJson.Seller.user_profile_photo : null;
        }
        console.log(purchaseJson);



        res.status(successStatus).send({
            message: 'purchase retrieved successfully',
            purchaseData: purchaseJson
        });

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to get purchase');
        return;
    }
}
