const appErr = require('this_pkg/error');
const axios = require('axios');

exports.handler = async(req, res) => {


	try {
		const result = await axios.post(`http://python_service:5020/get_data_geoinformation_service`, {
            service: 'train_model_recommended_engine',
            score_lots: req.body,
        })
		res.status(200).json(result.data);

	} catch(error) {
		appErr.handleRouteServerErr(req, res, error, 'failed to get lots number')
	}

}; 