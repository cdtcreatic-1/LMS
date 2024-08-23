const shippingDal = require('cccommon/dal/shipping')
const appErr = require('this_pkg/error')


exports.handler = async(req, res) => {

	const successStatus = 200;
	let shipping_options;     

	try {
		shipping_options = await shippingDal.getAllShippingOptions();

		return res.status(successStatus).send({
			message: 'payment options getting successfully',
			shipping_options: shipping_options
		});

	} catch (err) {
		appErr.handleRouteServerErr(req, res, err, 'failed to get shipping_options')
	}
	
}