const paymentDal = require('cccommon/dal/purchase')
const appErr = require('this_pkg/error')


exports.handler = async(req, res) => {

	const successStatus = 200;
	let payment_options;     

	try {
		payment_options = await paymentDal.getPaymentOptions();

		return res.status(successStatus).send({
			message: 'payment options getting successfully',
			payment_options: payment_options
		});

	} catch (err) {
		appErr.handleRouteServerErr(req, res, err, 'failed to get payment_options')
	}
	
}