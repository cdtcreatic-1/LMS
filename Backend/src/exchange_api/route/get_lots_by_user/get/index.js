const farmDal = require('cccommon/dal/farms');
const lotDal = require('cccommon/dal/lots');
const appErr = require('this_pkg/error');
const {frontend_host, app_url} = require('cccommon/config');

exports.handler = async (req, res) => {
    const id_user = Number(req.params.id_user);
    const is_completed = true;
    if (!id_user) {
        appErr.send(req, res, 'validation_error', 'Missing id_user');
        return;
    }

    try {
        const farms = await farmDal.getFarmsByIdUser(id_user);

        if (!farms || farms.length === 0) {
            appErr.send(req, res, 'farm_not_found', 'Farms not found');
            return;
        }

        let allLots = [];
        for (const farm of farms) {
            const lots = await lotDal.getLotsInfoByFarmId(farm.id_farm, is_completed);
            allLots = allLots.concat(lots);
        }

        const uniqueLots = [];
        const lotIds = new Set();
        allLots.forEach(lot => {
            if (!lotIds.has(lot.id_lot)) {
                if (lot.LotPhoto && lot.LotPhoto.lot_photo) {
                    lot.LotPhoto.lot_photo = app_url() + lot.LotPhoto.lot_photo;
                }
                uniqueLots.push(lot);
                lotIds.add(lot.id_lot);
            }
        });

        res.status(200).json({
            message: 'Lots retrieved successfully',
            data: allLots
        });
    } catch (error) {
        appErr.handleRouteServerErr(req, res, error, 'Error fetching lots');
    }
};
