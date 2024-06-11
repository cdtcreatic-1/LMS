const commonConfig = require('cccommon/config');
const lotQuantityDal = require('cccommon/dal/lot_quantity');
const lotDal = require('cccommon/dal/lots');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    let lotQuantity;
    const successStatus = 201;
    const { id_lot, total_quantity, samples_quantity, id_association, price_per_kilo } = req.body;
    const valErrs = [];

    const requiredFields = ['id_lot', 'total_quantity', 'samples_quantity', 'id_association', 'price_per_kilo'];
    requiredFields.forEach(field => {
        if (!req.body[field]) {
            valErrs.push({ [field]: 'missing' });
        }
    });

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    const totalquantityRegex = /^(?:[1-9]\d{0,2}|1000)$/;
    if (!totalquantityRegex.test(total_quantity)) {
        valErrs.push({ total_quantity: 'Debe contener solo numeros de 1 a 1000.' });
    }

    const priceperkiloRegex = /^(?:[1-9][0-9]?|100)$/;
    if (!priceperkiloRegex.test(samples_quantity)) {
        valErrs.push({ samples_quantity: 'Debe contener solo numeros de 1 a 100.' });
    }

    try {
        const lotExists = await lotDal.getLotByIdLot(id_lot);

        if (!lotExists) {
            appErr.send(req, res, 'lot_does_not_exist', 'Lot does not exists');
            return;
        }

        lotQuantity = await lotQuantityDal.createLotQuantity({ id_lot, total_quantity, samples_quantity, id_association, price_per_kilo });

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to create lot quantity');
        return;
    }

    res.status(successStatus).send({
        message: 'Lot Quantity created successfully',
        id_lot_quantity: lotQuantity.id_lot_quantity,
        id_lot: lotQuantity.id_lot,
        total_quantity: lotQuantity.total_quantity,
        samples_quantity: lotQuantity.samples_quantity,
        id_association: lotQuantity.id_association,
        price_per_kilo: lotQuantity.price_per_kilo,
    });
};
