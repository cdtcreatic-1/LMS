const appErr = require('this_pkg/error');
const axios = require('axios');

exports.handler = async(req, res) => {

    const variety_name = req.body.variety_name;
	try {
		const result = await axios.post(`http://python_service:5020/get_data_geoinformation_service`, {
            service: 'get_coffee_recommended_prices',
            variety_name: variety_name,
        })
		res.status(200).json(result.data);

	} catch(error) {
		appErr.handleRouteServerErr(req, res, error, 'failed to get lots number')
	}

}; 