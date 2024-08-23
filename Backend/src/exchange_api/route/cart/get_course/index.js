const cartDal = require('cccommon/dal/cart');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const id_buyer = Number(req.params.id_buyer);

    if (!id_buyer) {
        appErr.send(req, res, 'validation_error', 'missing or invalid id_buyer');
        return;
    }

    try {
        const cartCourses = await cartDal.getCartCoursesDataByIdUser(id_buyer);
        res.status(200).send({
            message: 'Courses in cart retrieved successfully',
            cartCourses,
        });
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to get courses in cart');
    }
};
