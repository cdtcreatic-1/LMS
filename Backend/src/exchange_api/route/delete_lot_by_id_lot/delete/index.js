const models = require("cccommon/models/internaldb");
const lotsDal = require('cccommon/dal/lots');
const scorelotsDal = require('cccommon/dal/score_lots');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const id_lot = Number(req.params.id_lot);

    const successStatus = 200;

    if (!id_lot) {
        appErr.send(req, res, 'validation_error', 'missing id_lot');
        return;
    }

    try {
        const lotsExists = await lotsDal.getLotByIdLot(id_lot)
        
        if (lotsExists.length == 0) {
            appErr.send(req, res, 'not_found', `Lot with id ${id_lot} does not exist`);
            return;
        }

        //await lotsDal.deleteLotById(id_lot)

        await models.Lots.update(
            { lot_status: false },
            {
              where: { id_lot },
            }
          );

        res.status(successStatus).send({
            message: 'Lot and related data deleted successfully',
        });

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to delete lot and its related data');
        return;
    }
}
