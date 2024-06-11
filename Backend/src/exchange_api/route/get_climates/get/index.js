const climatesDal = require('cccommon/dal/climates');
const appErr = require('this_pkg/error');


exports.handler = async (req, res) => {

  try {
    // Get user from database
    const climatesFound = await climatesDal.getAllClimates();

    // Check if user exists

    if (!climatesFound) {
      appErr.send(req, res, 'climates_not_found', 'climates not found');
      return;
    }

    // Send user data

    res.status(200).json(climatesFound);
  } catch (error) {
    appErr.handleRouteServerErr(req, res, error, 'failed to get Climates');
    return;
  };

};