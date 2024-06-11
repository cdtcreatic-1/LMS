const cartDal = require('cccommon/dal/cart');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const id_buyer = Number(req.params.id_buyer);
    const id_course = Number(req.params.id_course);

    let cartData;

    const successStatus = 200;

    if (!id_buyer) {
        appErr.send(req, res, 'validation_error', 'missing id_buyer');
        return;
    }

    if (!id_course) {
        appErr.send(req, res, 'validation_error', 'missing id_course'); 
        return;
    }

    try {
        cartData = await cartDal.deleteCartCourseDataByIdUser(id_buyer, id_course);
        res.status(successStatus).send({
            message: 'course removed from cart successfully',
        });

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to delete course from cart'); 
        return;
    }
};
