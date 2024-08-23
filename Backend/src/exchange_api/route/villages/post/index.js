const submoduleDal = require('cccommon/dal/submodule');
const villageDal = require('cccommon/dal/villages');
const cityModule = require('cccommon/dal/cities');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const successStatus = 201;
    const {
        id_city,
        village_name
    } = req.body;


    const valErrs = [];
    let requiredFields = [
        'id_city',
        'village_name'
    ];

    requiredFields.forEach(field => {
        if (!req.body[field]) {
            valErrs.push({ [field]: 'missing' });
        }
    });

    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    if (village_name && specialCharsRegex.test(village_name)) {
        valErrs.push({ village_name: 'contains special characters' });
    }
    if (id_city && specialCharsRegex.test(id_city)) {
        valErrs.push({ id_city: 'contains special characters' });
    }

    const leadingSpaceRegex = /^\s+/;
    requiredFields.forEach(field => {
        if (req.body[field] && leadingSpaceRegex.test(req.body[field])) {
            valErrs.push({ [field]: 'starts with excessive whitespace' });
        }
    });

    const onlyDigitsRegex = /^\d+$/; 
    if (onlyDigitsRegex.test(village_name)) {
        valErrs.push({ village_name: 'should not be only numeric values' });
    }

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    try {
        const citieExists = await cityModule.getCityByIdCity(id_city)

        if (!citieExists) {
            appErr.send(req, res, 'not_found', 'City does not exists');
            return;
        }

        const village = await villageDal.createVillage({
            id_city,
            village_name
        });

        res.status(successStatus).send(village);

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to create submodule');
    }
};
