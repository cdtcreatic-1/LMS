const lotsDal = require('cccommon/dal/lots');
const appErr = require('this_pkg/error');
const { frontend_host, app_url } = require('cccommon/config');

exports.handler = async (req, res) => {
    const id_user = req.params.id_user
    try {
        const lotsFound = await lotsDal.getLotData(id_user);

        const updatedLots = lotsFound.map(lot => {
            return {
                ...lot,
                user_cover_photo: lot.user_cover_photo ?  lot.user_cover_photo: null,
                user_profile_photo: lot.user_profile_photo ?  lot.user_profile_photo: null,
            };
        });

        res.status(200).json(updatedLots);
    } catch (error) {
        appErr.handleRouteServerErr(req, res, error, 'failed to get all farmers');
    }
};
