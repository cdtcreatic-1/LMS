const cartDal = require('cccommon/dal/cart');
const userDal = require('cccommon/dal/user');
const appErr = require('this_pkg/error');


exports.handler = async (req, res) => {

    let cartData;
    const successStatus = 200;
    const { id_buyer, id_course } = req.body;

    const admin = await userDal.getUserByUserRole(4);
    const id_seller = admin.id_user;
    const valErrs = [];

    const requiredFields = ['id_buyer', 'id_course'];

    requiredFields.forEach(field => {
        if (!req.body[field]) {
            valErrs.push({ [field]: 'missing' });
        }
    });

    if (id_seller == id_buyer) {
        appErr.send(req, res, 'validation_buy_course_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    try {
        const cartExist = await cartDal.getCartDataByIdUserIdCourse(id_seller, id_buyer, id_course);
        if (cartExist[0]) {

            appErr.send(req, res, 'cart_exist', 'Cart already exists');
            return;
        }

        cartData = await cartDal.saveCartCourseData({ id_seller, id_buyer, id_course});
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to create cart');
        return;
    }

    res.status(successStatus).send({
        message: 'cart created successfully',
        cartData: cartData
    });
}