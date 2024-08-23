const lotsDal = require('cccommon/dal/lots');
const farmsDal = require('cccommon/dal/farms');
const appErr = require('this_pkg/error');
const { clienteAxios } = require('../../../axios/clienteAxios');


exports.handler = async (req, res) => {
    const id_farm = req.body.id_farm;
    const lot_number = req.body.lot_number;
    const id_variety = req.body.id_variety;
    const id_profile = req.body.id_profile;
    const id_roast = req.body.id_roast;

    const successStatus = 201;
    const valErrs = [];

    let farm;
    let lots;

    if (!id_farm) {
        valErrs.push({ id_farm: 'missing' });
    }

    if (!lot_number) {
        valErrs.push({ lot_number: 'missing' });
    }

    if (!id_variety) {
        valErrs.push({ id_variety: 'missing' });
    }

    if (!id_profile) {
        valErrs.push({ id_profile: 'missing' });
    }

    if (!id_roast) {
        valErrs.push({ id_roast: 'missing' });
    }

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    try {

        farm = await farmsDal.getFarmsByIdFarm(id_farm);

        if (!farm) {
            farm.send(req, res, 'not_found', 'Farm not found');
            return;
        }

        lots = await lotsDal.createLots({ id_farm, lot_number, id_variety, id_profile, id_roast });

        const { id_lot } = lots.dataValues

        const { data } = await clienteAxios.post(
            "/consume_farmer_profile_data_microservice", {
            microservice: "get_lot_coding",
            id_lot
        });

        lots.dataValues.lot_coding = data.lot_coding

        await lotsDal.updateLots(lots.dataValues)

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to create lot');
        return;
    }

    // Send just enough for debugging & logged-in status/identity in UIs.
    res.status(successStatus).send({
        message: 'Lot created successfully',
        lot_id: lots
    })
};
