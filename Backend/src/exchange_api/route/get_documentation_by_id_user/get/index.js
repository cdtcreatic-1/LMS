const userDal = require('cccommon/dal/user');
const farmsDal = require('cccommon/dal/farms');
const farmsDocDal = require('cccommon/dal/farm_documentation');
const lotsDal = require('cccommon/dal/lots');
const lotsDocDal = require('cccommon/dal/lot_certifications');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const id_user = Number(req.params.id_user);
    const successStatus = 200;
    if(!id_user){
        appErr.send(req, res, 'validation_error', 'Missing id_user');
        return;
      }
    try {
        const userExists = await userDal.getUserByIdUser(id_user);        
        if (!userExists) {
            appErr.send(req, res, 'user_not_found', 'User not found');
            return;
        }

        const farmsData = await farmsDal.getFarmsByIdUser(id_user);
        const response = [];

        for (const farm of farmsData) {
            const farmDoc = await farmsDocDal.getFarmDocumentationById(farm.dataValues.id_farm);
            if (!farmDoc) {
                appErr.send(req, res, 'documentation_not_found', 'Documentation not found for farm id: ' + farm.dataValues.id_farm);
                return;
            }
            if (farmDoc.dataValues.farm_documentation_id_document) {
                farmDoc.dataValues.farm_documentation_id_document = farmDoc.dataValues.farm_documentation_id_document.replace('uploads/', '');
            }

            if (farmDoc.dataValues.farm_documentation_rut) {
                farmDoc.dataValues.farm_documentation_rut = farmDoc.dataValues.farm_documentation_rut.replace('uploads/', '');
            }

            if (farmDoc.dataValues.farm_documentation_chamber_commerce) {
                farmDoc.dataValues.farm_documentation_chamber_commerce = farmDoc.dataValues.farm_documentation_chamber_commerce.replace('uploads/', '');
            }

            const lotsData = await lotsDal.getLotsInfoByUser(farm.dataValues.id_farm);
            const farmResponse = {
                farmsDoc: farmDoc
            };

            for (const lot of lotsData) {
                const lotDoc = await lotsDocDal.getLotCertificationById(lot.dataValues.id_lot);
                if (lotDoc.dataValues.product_sc_certificate) {
                    lotDoc.dataValues.product_sc_certificate = lotDoc.dataValues.product_sc_certificate.replace('uploads/', '');
                }

                if (lotDoc.dataValues.product_taster_certificate) {
                    lotDoc.dataValues.product_taster_certificate = lotDoc.dataValues.product_taster_certificate.replace('uploads/', '');
                }

                farmResponse[`lot_${lot.dataValues.id_lot}`] = { lotsDoc: lotDoc };
            }

            response.push(farmResponse);
        }

        res.status(successStatus).send(response);
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to get user by id');
    }
};
