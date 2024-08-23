const farmsDal = require('cccommon/dal/farms');
const scorelotsDal = require('cccommon/dal/score_lots');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const id_farm = Number(req.params.id_farm);

    const successStatus = 200;

    if (!id_farm) {
        appErr.send(req, res, 'validation_error', 'missing id_farm');
        return;
    }

    try {
        const farmExists = await farmsDal.getFarmsByIdFarm(id_farm);
        
        if (farmExists.length == 0) {
            appErr.send(req, res, 'not_found', `Farm with id ${id_farm} does not exist`);
            return;
        }

        await scorelotsDal.deleteScoreLots(id_farm);
        await farmsDal.deleteFarmById(id_farm);

        res.status(successStatus).send({
            message: 'Farm and related data deleted successfully',
        });

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to delete farm and its related data');
        return;
    }
}
