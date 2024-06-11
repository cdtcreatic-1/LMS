const evaluationDal = require('cccommon/dal/submoduleEvaluation');
const submoduleDal = require('cccommon/dal/submodule');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    let evaluation;

    const successStatus = 201;

    const {
        evaluation_title,
        evaluation_description,
        id_submodule
    } = req.body;

    let valErrs = [];

    let requiredFields = [
        'evaluation_title',
        'id_submodule'
    ];

    requiredFields.forEach(field => {
        if (!req.body[field]) {
            valErrs.push({ [field]: 'missing' });
        }
    });

    // Validation for character limits
    const maxLengths = {
        evaluation_title: 250,
        evaluation_description: 500
    };
    const minLengths = {
        evaluation_title: 5,
        evaluation_description: 20
    };

    for (const field in maxLengths) {
        if (req.body[field] && req.body[field].length > maxLengths[field]) {
            valErrs.push({ [field]: `should not exceed ${maxLengths[field]} characters` });
        }
    }

    for (const field in minLengths) {
        if (req.body[field] && req.body[field].length < minLengths[field]) {
            valErrs.push({ [field]: `should have at least ${minLengths[field]} characters` });
        }
    }

    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    if (evaluation_title && specialCharsRegex.test(evaluation_title)) {
        valErrs.push({ evaluation_title: 'contains special characters' });
    }
    if (evaluation_description && specialCharsRegex.test(evaluation_description)) {
        valErrs.push({ evaluation_description: 'contains special characters' });
    }

    const leadingSpaceRegex = /^\s+/;
    requiredFields.forEach(field => {
        if (req.body[field] && leadingSpaceRegex.test(req.body[field])) {
            valErrs.push({ [field]: 'starts with excessive whitespace' });
        }
    });

    const onlyDigitsRegex = /^\d+$/;
    if (onlyDigitsRegex.test(evaluation_title)) {
        valErrs.push({ evaluation_title: 'should not be only numeric values' });
    }
    if (onlyDigitsRegex.test(evaluation_description)) {
        valErrs.push({ evaluation_description: 'should not be only numeric values' });
    }
    if (!onlyDigitsRegex.test(id_submodule)) {
        valErrs.push({ id_submodule: 'should contain only numeric values' });
    }

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    try {
        const submoduleExists = await submoduleDal.getSubmoduleById(id_submodule);

        if (!submoduleExists) {
            appErr.send(req, res, 'submodule_not_found', 'Submodule not found');
            return;
        }

        const evaluationExists = await evaluationDal.getEvaluationByTitle(evaluation_title);

        if (evaluationExists) {
            appErr.send(req, res, 'evaluation_exist', 'Evaluation already exists');
            return;
        }

        evaluation = await evaluationDal.createEvaluation({
            evaluation_title,
            evaluation_description,
            id_submodule
        });

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to create evaluation');
        return;
    }

    res.status(successStatus).send(evaluation);
};
