const models = require('cccommon/models/internaldb');


async function getCitiesInCauca() {
  try {
    const cities = await models.Cities.findAll({
      include: [
        {
          model: models.States,
          where: { state_name: 'CAUCA' },
          include: [
            {
              model: models.Countries,
              where: { id_country: 48 },
            },
          ],
        },
      ],
    });
    return cities;
  } catch (error) {
    throw new Error(`Error getting cities in Cauca: ${error.message}`);
  }
}

async function getCitiesWithIdState(id_state) {

  try {

      const states = await models.Cities.findAll({
          where: { id_state: id_state }
      });

      return states;
  } catch (error) {
      throw new Error(`Error getting states with this id_state: ${error.message}`);
  }
}

async function getCityByIdCity(id_city) {
  try {
    const city = await models.Cities.findAll({
      where: { id_city: id_city },
    });
    return city;
  } catch (error) {
    throw new Error(`Error getting city with this id_city: ${error.message}`);
  }
}


module.exports = {
  getCitiesInCauca,
  getCityByIdCity,
  getCitiesWithIdState
};