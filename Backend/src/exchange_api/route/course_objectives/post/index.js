const commonConfig = require('cccommon/config');
const courseDal = require('cccommon/dal/course');
const appErr = require('this_pkg/error');
const courseObjectiveDal = require('cccommon/dal/courseObjective');

exports.handler = async (req, res) => {
    let objective;

    const successStatus = 201;

    const {
        objective_text,
        id_course
    } = req.body;

    const valErrs = [];

    let requiredFields = ['objective_text', 'id_course'];

    requiredFields.forEach(field => {
        if (!req.body[field]) {
            valErrs.push({ [field]: 'missing' });
        }
    });

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    // Validation for character limits
    const maxLengths = {
        objective_text: 500
    };
    const minLengths = {
        objective_text: 10
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

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    const specialCharsRegex = /[@#$^&*()_+\-=\[\]{};':"\\|<>\/]+/;

    if (objective_text && specialCharsRegex.test(objective_text)) {
        valErrs.push({ objective_text: 'contains special characters' });
    }

    if (id_course && specialCharsRegex.test(id_course)) {
        valErrs.push({ id_course: 'contains special characters' });
    }

    const leadingSpaceRegex = /^\s+/;
    requiredFields.forEach(field => {
        if (req.body[field] && leadingSpaceRegex.test(req.body[field])) {
            valErrs.push({ [field]: 'starts with excessive whitespace' });
        }
    });

    const onlyDigitsRegex = /^\d+$/;
    if (onlyDigitsRegex.test(objective_text)) {
        valErrs.push({ objective_text: 'should not be only numeric values' });
    }
    if (!onlyDigitsRegex.test(id_course)) {
        valErrs.push({ id_course: 'should contain only numeric values' });
    }
    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    try {
        const courseExists = await courseDal.getCourseById(id_course);

        if (!courseExists) {
            appErr.send(req, res, 'course_not_found', 'Course not found');
            return;
        }

        objective = await courseObjectiveDal.createObjective({
            objective_text,
            id_course
        });

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to create course objective');
        return;
    }

    res.status(successStatus).send({
        objective_text: objective.objective_text,
        id_course: objective.id_course,
        id_objective: objective.id_objective
    });
};
