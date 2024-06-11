const models = require('cccommon/models/internaldb');

async function saveBusinesmanCoffeeInterested(data) {
  try {
    const BusinesmanCoffeeInterested = await models.BusinesmanCoffeeInterested.create(data);
    return BusinesmanCoffeeInterested;
  } catch (error) {
    throw new Error(`Error saving data: ${error.message}`);
  }
}

async function updateBusinesmanCoffeeInterested(id_user, data) {
  try {
    const BusinesmanCoffeeInterested = await models.BusinesmanCoffeeInterested.update(data, {
        where: { id_user: id_user }
      });
    return BusinesmanCoffeeInterested
  } catch (error) {
    throw new Error(`Error updating data: ${error.message}`);
  }
}

async function getBusinesmanCoffeeInterested(id_user) {
  try {
    const BusinesmanCoffeeInterested = await models.BusinesmanCoffeeInterested.findOne({
        where: { id_user: id_user }
      });
    return BusinesmanCoffeeInterested
  } catch (error) {
    throw new Error(`Error getting data: ${error.message}`);
  }
}

module.exports = {
  saveBusinesmanCoffeeInterested,
  updateBusinesmanCoffeeInterested,
  getBusinesmanCoffeeInterested
};
