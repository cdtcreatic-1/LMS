const purchaseCourseDal = require('cccommon/dal/purchase_course')
const userCourseDal = require('cccommon/dal/user_course');
const cartCourseDal = require('cccommon/dal/cart');
const moduleDal = require('cccommon/dal/module');
const userSubmoduleProgressDal = require('cccommon/dal/user_submodule_progress');
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
    } else if (transactionStateSting == 'Aceptada') {

        id_purchase_status = 2;
    } else if (transactionStateSting == 'Rechazada') {

        id_purchase_status = 3;
    } else {

        appErr.send(req, res, 'validation_error', 'transaction state not supported');
        return;
    }

    const id_course = purchaseStatus.x_extra3;
    const id_user = purchaseStatus.x_extra4;
    const id_shipping_option = parseInt(purchaseStatus.x_extra5);
    const shipping_address = purchaseStatus.x_extra6;
    const additional_notes = purchaseStatus.x_extra7;
    const price = purchaseStatus.x_extra8;

    for (const cartId of cartVector) {
        try {
            const cartCourse = await cartCourseDal.getCartCourseByIdCart(cartId);
            const cartIsInPurchase = await cartDal.setIsInPurchaseByIdCart(cartId);

            if (!cartIsInPurchase || cartIsInPurchase.length === 0) {
                appErr.send(req, res, 'validation_error', 'Cart is not in purchase');
                return;
            }

            await cartDal.deleteCartDataByIdCartCourse(cartId);

            const purchaseData = await purchaseCourseDal.createPurchaseCourse({
                id_seller: cartCourse.id_seller,
                id_buyer: cartCourse.id_buyer,
                id_course: cartCourse.id_course,
                id_shipping_option,
                id_purchase_status,
                shipping_address,
                additional_notes,
                price
            });

            await purchaseCourseDal.updatePurchaseStatusByIdPurchase(purchaseData.id_purchase_course, id_purchase_status);

        } catch (err) {
            appErr.handleRouteServerErr(req, res, err, 'failed to set cart in purchase');
            return;
        }
    }

    await userCourseDal.createUserCourse({ id_user, id_course });

    const modules = await moduleDal.getModulesByIdCourseWithSubmodules(id_course);

    modules.forEach(module => {
        const { Submodules } = module;

        Submodules.forEach(submodule => {
            const { id_submodule } = submodule;

            async function save() {
                await userSubmoduleProgressDal.createUserSubmoduleProgress({ id_user, id_submodule })
            }

            save();
        })
    })


    return res.status(successStatus).send({
        data: 'Updated cart and purchase data',
        cartVector: cartVector,
        purchaseVector: purchaseVector,
        transactionStateSting: transactionStateSting,
    });
}