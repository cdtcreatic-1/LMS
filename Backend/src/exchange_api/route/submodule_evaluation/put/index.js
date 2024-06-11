const evaluationDal = require('cccommon/dal/submoduleEvaluation');
const submoduleDal = require('cccommon/dal/submodule');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const successStatus = 200;

    const {
        id_evaluation,
        evaluation_title,
        evaluation_description,
        id_submodule
    } = req.body;

    let updateData = {};

    if (evaluation_title) updateData.evaluation_title = evaluation_title;
    if (evaluation_description) updateData.evaluation_description = evaluation_description;
    if (id_submodule) updateData.id_submodule = id_submodule;

    const valErrs = [];

    if (!id_evaluation) {
        appErr.send(req, res, 'missing_id', 'Evaluation ID missing');
        return;
    }

    let requiredFields = [
        'id_evaluation',
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
    const fieldsToCheckForSpecialChars = [
        'id_evaluation',
        'evaluation_title',
        'evaluation_description',
        'id_submodule'
    ];

    fieldsToCheckForSpecialChars.forEach(field => {
        if (req.body[field] && specialCharsRegex.test(req.body[field])) {
            valErrs.push({ [field]: 'contains special characters' });
        }
    });

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
    if (!onlyDigitsRegex.test(id_evaluation)) {
        valErrs.push({ id_evaluation: 'should contain only numeric values' });
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

        const evaluationExists = await evaluationDal.getEvaluationById(id_evaluation);
        if (!evaluationExists) {
            appErr.send(req, res, 'evaluation_not_found', 'Evaluation not found');
            return;
        }

        evaluation = await evaluationDal.updateEvaluation(id_evaluation, updateData);
        
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to update evaluation');
        return;
    }

    res.status(successStatus).send({
        message: "Evaluation with title: "+evaluation.evaluation_title+" successfully updated",
        evaluation_title: evaluation.evaluation_title,
        evaluation_description: evaluation.evaluation_description,
        id_submodule: evaluation.id_submodule,
        id_evaluation: evaluation.id_evaluation
    });
};

