const cartDal = require('cccommon/dal/cart');
const userDal = require('cccommon/dal/user');
const appErr = require('this_pkg/error');


exports.handler = async (req, res) => {

    let cartData;
    const successStatus = 200;
    const { id_seller, id_buyer, id_lot } = req.body;

    const valErrs = [];

    const requiredFields = ['id_seller', 'id_buyer', 'id_lot'];

    requiredFields.forEach(field => {
        if (!req.body[field]) {
            valErrs.push({ [field]: 'missing' });
        }
    });

    if (id_seller == id_buyer) {
        appErr.send(req, res, 'validation_buy_lot_error', appErr.mergeValErrLists(valErrs));
        return;
    }
    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    try {
        const cartExist = await cartDal.getCartDataByIdUserIdLot(id_seller, id_buyer, id_lot);
        if (cartExist[0]) {

            appErr.send(req, res, 'cart_exist', 'Cart already exists');
            return;
        }

        cartData = await cartDal.saveCartData({ id_seller, id_buyer, id_lot});
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to create cart');
        return;
    }

    res.status(successStatus).send({
        message: 'cart created successfully',
        cartData: cartData
    });
}