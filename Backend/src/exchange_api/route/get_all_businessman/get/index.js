const usersDal = require('cccommon/dal/user')
const appErr = require('this_pkg/error');
const {frontend_host, app_url} = require('cccommon/config');


exports.handler = async(req, res) => {
	try {

		const userFound = await usersDal.getAllBusinessman();
		
		for(let indexUser in userFound)
		{
			if(userFound[indexUser].dataValues.user_profile_photo)
			{
				userFound[indexUser].dataValues.user_profile_photo = app_url() + userFound[indexUser].dataValues.user_profile_photo;
			}
		}

		res.status(200).json(userFound);

	} catch(error) {
		appErr.handleRouteServerErr(req, res, error, 'failed to get all farmers')
	}

}; 