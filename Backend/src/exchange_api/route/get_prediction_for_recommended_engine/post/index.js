const appErr = require('this_pkg/error');
const axios = require('axios');

exports.handler = async(req, res) => {

    const id_user = req.body.id_user;
	const id_best_lots = req.body.id_best_lots;
	try {
		const result = await axios.post(`http://python_service:5020/get_data_geoinformation_service`, {
            service: 'get_prediction_for_recommended_engine',
            id_user: id_user,
			id_best_lots: id_best_lots,
        })
		res.status(200).json(result.data);

	} catch(error) {
		appErr.handleRouteServerErr(req, res, error, 'failed to get lots number')
	}

}; 