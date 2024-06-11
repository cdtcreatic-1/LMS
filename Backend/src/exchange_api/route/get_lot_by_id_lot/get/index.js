const lotsDal = require('cccommon/dal/lots');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const id_lot = Number(req.params.id_lot);
    let lots;

    const successStatus = 200;
    const valErrs = [];

    if (!id_lot) {
        valErrs.push({ id_lot: 'missing' });
    }

    if (valErrs.length > 0) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    try {
        lots = await lotsDal.getLotByIdLot(id_lot);
        
        if (lots.dataValues.LotPhoto && lots.dataValues.LotPhoto.lot_photo) {
            lots.dataValues.LotPhoto.lot_photo = app_url() + lots.dataValues.LotPhoto.lot_photo;
        }

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to get user by email');
        return;
    }

    // Send just enough for debugging & logged-in status/identity in UIs.
    res.status(successStatus).send({
        message: 'retrieved lots successfully',
        lots: lots
    });
};
