const appErr = require('this_pkg/error');
const axios = require('axios');
const { frontend_host, app_url } = require('cccommon/config');

exports.handler = async (req, res) => {


	try {
		const result = await axios.post(`http://python_service:5020/get_data_geoinformation_service`, {
			service: 'get_sorted_lots_based_on_buyer_preferences',
			id_seller: req.body.id_seller,
			id_buyer: req.body.id_buyer,
		})
		//ask type of result.data

		if (result.data.error) {
			return res.status(200).send([]);
		}

		const dataJson = result.data

		for (data of dataJson.sorted_lots) {
			if (data.lot_photo) {
				data.lot_photo = app_url() + data.lot_photo;
			}
		}
		res.status(200).json(dataJson.sorted_lots);

	} catch (error) {
		appErr.handleRouteServerErr(req, res, error, 'failed to get lots number')
	}

}; 