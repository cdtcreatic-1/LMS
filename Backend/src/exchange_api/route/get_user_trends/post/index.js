const appErr = require('this_pkg/error');
const axios = require('axios');
const {frontend_host, app_url} = require('cccommon/config');

exports.handler = async(req, res) => {
	const id_role = req.body.id_role
	console.log({id_role})
	try {
		const result = await axios.post(`http://python_service:5020/get_data_geoinformation_service`, {
            service: 'get_user_trends',
            id_role: id_role
        })
		//ask type of result.data
		console.log({result})

		const dataJson = result.data

		if(id_role == 2){
			//Ask if dataJson.ranking exists
			if(!dataJson.ranking)
			{
				res.status(200).json([]);
				return;
			}
			for(data of dataJson.ranking){

				if(data.chart_paths)
				{
					//replace ./generated_charts/ with /charts/
					data.chart_paths.chart_profile_path = data.chart_paths.chart_profile_path.replace('./generated_charts/', 'charts/')
					data.chart_paths.chart_profile_path = app_url() + data.chart_paths.chart_profile_path

					data.chart_paths.chart_roast_path = data.chart_paths.chart_roast_path.replace('./generated_charts/', 'charts/')
					data.chart_paths.chart_roast_path = app_url() + data.chart_paths.chart_roast_path

					data.chart_paths.chart_variety_path = data.chart_paths.chart_variety_path.replace('./generated_charts/', 'charts/')
					data.chart_paths.chart_variety_path = app_url() + data.chart_paths.chart_variety_path
				}
				if(data.chart_image_path)
				{
					//replace ./generated_charts/ with /charts/
					data.chart_image_path = data.chart_image_path.replace('./generated_charts/', 'charts/')
					data.chart_image_path = app_url() + data.chart_image_path
				}
				
				if(data.user_profile_photo)
				{
					data.user_profile_photo = app_url() + data.user_profile_photo;
				}
			}
		}
		if(id_role == 1)
		{
			if(!dataJson.ranking)
			{
				res.status(200).json([]);
				return;
			}
			for (data of dataJson.ranking) {
				if(data.user_profile_photo)
				{
					data.user_profile_photo = app_url() + data.user_profile_photo;
				}
			}
		}
		res.status(200).json(dataJson.ranking);

	} catch(error) {
		appErr.handleRouteServerErr(req, res, error, 'failed to get lots number')
	}

}; 