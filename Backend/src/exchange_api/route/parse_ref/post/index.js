const purchaseDal = require('cccommon/dal/purchase')
const lotQuantityDal = require('cccommon/dal/lot_quantity');
const cartDal = require('cccommon/dal/cart')
const appErr = require('this_pkg/error');
const axios = require('axios');

exports.handler = async (req, res) => {

    let purchaseData;
    const successStatus = 200;
    let id_purchase_status;

    const { reference } = req.body;

    if (!reference) {
        appErr.send(req, res, 'validation_error', 'missing data');
        return;
    }

    const url = 'https://secure.epayco.co/validation/v1/reference/' + reference;
    try {

        purchaseData = await axios.get(url);

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to get purchase data');
        return;
    }

    if (!purchaseData) {
        appErr.send(req, res, 'validation_error', 'missing data');
        return;
    }

    const purchaseStatus = purchaseData.data.data;

    let cartVectorString = purchaseStatus.x_extra1; // "[1, 2 ....]
    //Remove the brackets
    cartVectorString = cartVectorString.substring(1, cartVectorString.length - 1);
    //Convert string to array
    const cartVector = cartVectorString.split(',').map(Number);

    let purchaseVectorString = purchaseStatus.x_extra2;
    //Remove the brackets
    purchaseVectorString = purchaseVectorString.substring(1, purchaseVectorString.length - 1);
    //Convert string to array
    const purchaseVector = purchaseVectorString.split(',').map(Number);

    const transactionStateSting = purchaseStatus.x_transaction_state;


    if (transactionStateSting == 'Pendiente') {
    
        id_purchase_status = 1;
    }else if (transactionStateSting == 'Aceptada') {
    
        id_purchase_status = 2;
    } else if (transactionStateSting == 'Rechazada') {
    
        id_purchase_status = 3;
    } else {
    
        appErr.send(req, res, 'validation_error', 'transaction state not supported');
        return;
    }

    for (const purchaseId of purchaseVector) {
        try {
            const purchaseData = await purchaseDal.getSimplePurchaseByIdPurchase(purchaseId);

            if (!purchaseData) {
                appErr.send(req, res, 'validation_error', 'purchase not found');
                return;
            }

            await purchaseDal.updatePurchaseStatusByIdPurchase(purchaseId, id_purchase_status);

        } catch (err) {
            appErr.handleRouteServerErr(req, res, err, 'failed to update purchase data');
            return;
        }
    }


    for (const cartId of cartVector) {
        try {
            const cartIsInPurchase = await cartDal.setIsInPurchaseByIdCart(cartId);

            if (!cartIsInPurchase) {
                appErr.send(req, res, 'validation_error', 'Cart is not in purchase');
                return;
            }

            await cartDal.deleteCartDataByIdCart(cartId);

        } catch (err) {
            appErr.handleRouteServerErr(req, res, err, 'failed to set cart in purchase');
            return;
        }
    }


    return res.status(successStatus).send({
        data: 'Updated cart and purchase data',
        cartVector: cartVector,
        purchaseVector: purchaseVector,
        transactionStateSting: transactionStateSting,
    });
}