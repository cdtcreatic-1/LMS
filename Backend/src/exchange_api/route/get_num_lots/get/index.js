const lotsNumDal = require('cccommon/dal/lots')
const appErr = require('this_pkg/error');


exports.handler = async(req, res) => {

	const id_farm = Number(req.params.id_farm)
	if(!id_farm){
		appErr.send(req, res, 'validation_error', 'Missing id_farm');
		return;
	}
	try {

		const lotsNumber = await lotsNumDal.getNumberLots(id_farm);
		if (!lotsNumber) {
			appErr.send(req, res, 'not_found', 'Number of lots not found');
			return;
		}
		const lotList = [];
		for (let i = 1; i <= lotsNumber[0].dataValues?.farm_number_lots; i++) {
			lotList.push(`Lote ${i}`);
		}
		res.status(200).send({ lots: lotList });

	} catch(error) {
		appErr.handleRouteServerErr(req, res, error, 'failed to get lots number')
	}

}; 