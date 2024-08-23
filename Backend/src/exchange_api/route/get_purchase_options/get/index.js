const purchaseDal = require('cccommon/dal/purchase')
const appErr = require('this_pkg/error')


exports.handler = async(req, res) => {

	const successStatus = 200;
	let purchase_options;     

	try {
		purchase_options = await purchaseDal.getPurchaseOptions();

		return res.status(successStatus).send({
			message: 'purchase options getting successfully',
			purchase_options: purchase_options
		});

	} catch (err) {
		appErr.handleRouteServerErr(req, res, err, 'failed to get purchase_options')
	}
	
}