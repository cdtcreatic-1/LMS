const cartDal = require('cccommon/dal/cart');
const userDal = require('cccommon/dal/user');
const appErr = require('this_pkg/error');


exports.handler = async (req, res) => {
    const id_buyer = Number(req.params.id_buyer);
    const id_lot = Number(req.params.id_lot);

    let cartData;

    const successStatus = 200;

    if (!id_buyer) {
        appErr.send(req, res, 'validation_error', 'missing id_buyer');
        return;
    }

    if (!id_lot) {
        appErr.send(req, res, 'validation_error', 'missing id_lot');
        return;
    }

    try {
        cartData = await cartDal.deleteCartDataByIdUser(id_buyer, id_lot);
        res.status(successStatus).send({
            message: 'cart deleted successfully',
        });

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to delete cart');
        return;
    }
    
}