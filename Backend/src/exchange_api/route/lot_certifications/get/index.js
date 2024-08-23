const lotCertificationDal = require('cccommon/dal/lot_certifications');
const appErr = require('this_pkg/error');
const {frontend_host, app_url} = require('cccommon/config');

exports.handler = async (req, res) => {
    const id_lot = Number(req.params.id_lot);

    try {

        if(!id_lot || isNaN(id_lot)){
            appErr.send(req, res, 'invalid_input', 'Invalid id_lot');
            return;
        }

        const lotCertification = await lotCertificationDal.getLotCertificationById(id_lot);
        
        if (!lotCertification) {
            appErr.send(req, res, 'not_found', 'Lot certification not found');
            return;
        }
        res.status(200).send(lotCertification);
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'Failed to get lot certification');
    }
};
