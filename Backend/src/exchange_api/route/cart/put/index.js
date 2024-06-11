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


    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    try {
        cartData = await cartDal.updateCartDataByIdUser({ id_seller, id_buyer, id_lot});
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to update cart');
        return;
    }    

    res.status(successStatus).send({
        message: 'cart updated successfully',
        cartData: cartData
    });
}