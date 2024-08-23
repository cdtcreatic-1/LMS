const purchaseCourseDal = require('cccommon/dal/purchase_course')
const userDal = require('cccommon/dal/user');
const appErr = require('this_pkg/error');


exports.handler = async (req, res) => {
    const id_buyer = Number(req.params.id_buyer);
    if(!id_buyer){
        appErr.send(req, res, 'validation_error', 'Missing id_buyer');
        return;
      }

    let purchaseData;
    const successStatus = 200;

    if (!id_buyer) {
        appErr.send(req, res, 'validation_error', 'missing id_buyer');
        return;
    }

    try {
        const userExists = await userDal.getUserByIdUser(id_buyer);
        if (!userExists) {
            appErr.send(req, res, 'not_found', 'User not found');
            return;
        }

        purchaseData = await purchaseCourseDal.getPurchaseCourseByIdBuyer(id_buyer);
        res.status(successStatus).send({
            message: 'purchase retrieved successfully',
            purchaseData: purchaseData
        });

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to get purchase');
        return;
    }
}
