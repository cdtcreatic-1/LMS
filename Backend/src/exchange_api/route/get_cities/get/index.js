const citiesDal = require('cccommon/dal/cities');
const appErr = require('this_pkg/error');


exports.handler = async (req, res) => {

  const id_state = Number(req.params.id_state);
  if(!id_state){
    appErr.send(req, res, 'validation_error', 'Missing id_state');
    return;
  }

  try {
    const citiesFound = await citiesDal.getCitiesWithIdState(id_state);

    if (!citiesFound) {
      appErr.send(req, res, 'cities_not_found', 'Cities not found');
      return;
    }

    res.status(200).json(citiesFound);
  } catch (error) {
    appErr.handleRouteServerErr(req, res, error, 'failed to get cities');
    return;
  };

};