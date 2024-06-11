const cartDal = require('cccommon/dal/cart');
const userDal = require('cccommon/dal/user');
const appErr = require('this_pkg/error');
const farmPhotosDal = require('cccommon/dal/farm_photos');
const { frontend_host, app_url } = require('cccommon/config');


exports.handler = async (req, res) => {

    const id_buyer = Number(req.params.id_buyer);

    let cartData;
    let farmPhotos;

    const successStatus = 200;

    if (!id_buyer) {
        appErr.send(req, res, 'validation_error', 'missing id_buyer');
        return;
    }

    try {
        cartData = await cartDal.getCartDataByIdUser(id_buyer);

        for (let cart in cartData) {
            const cartJSON = cartData[cart].toJSON();

            if (cartJSON.Lot.LotPhoto?.lot_photo) {
                //Remove the word "uploads/" from the path
                cartData[cart].dataValues.Lot.dataValues.LotPhoto.dataValues.lot_photo = app_url() + cartJSON.Lot.LotPhoto.lot_photo;
            }
        }
        res.status(successStatus).send({
            message: 'cart retrieved successfully',
            cartData: cartData
        });

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to get cart');
        return;
    }
}