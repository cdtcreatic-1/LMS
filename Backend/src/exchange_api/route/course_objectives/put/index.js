const objectiveDal = require('cccommon/dal/courseObjective');
const courseDal = require('cccommon/dal/course');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const successStatus = 200;

    const {
        id_objective,
        objective_text,
        id_course
    } = req.body;

    let updateData = {};

    const valErrs = [];

    if (objective_text) updateData.objective_text = objective_text;
    if (id_course) updateData.id_course = id_course;
    if (!id_objective && !id_course && !objective_text) {
        appErr.send(req, res, 'all_fields_missing', 'all fileds are missing');
        return;
    }
    if (!id_objective || !id_course ) {
        appErr.send(req, res, 'missing_id', 'Objective ID missing');
        return;
    }
    if (!objective_text) {
        appErr.send(req, res, 'input_validation_failed', 'Objective text missing');
        return;
    }  
    
    const specialCharsRegexobjet = /^[0-9a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s,.\-_\/;:]{20,200}$/;
    if (!specialCharsRegexobjet.test(objective_text)) {
        valErrs.push({ objective_text: 'contains some special characters not allowed' });
    }


    // const maxLengths = {
    //     objective_text: 500,
    //     id_course: 10, 
    // };
    // const minLengths = {
    //     objective_text: 20, 
    //     id_course: 5, 
    // };

    // for (const field in maxLengths) {
    //     if (req.body[field] && req.body[field].length > maxLengths[field]) {
    //         valErrs.push({ [field]: `should not exceed ${maxLengths[field]} characters` });
    //     }
    // }

    // for (const field in minLengths) {
    //     if (req.body[field] && req.body[field].length < minLengths[field]) {
    //         valErrs.push({ [field]: `should have at least ${minLengths[field]} characters` });
    //     }
    // }

    // const specialCharsRegex = /[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]+/;
    // const fieldsToCheckForSpecialChars = [
    //     'id_objective',
    //     'objective_text',
    //     'id_course'
    // ];

    // fieldsToCheckForSpecialChars.forEach(field => {
    //     if (req.body[field] && specialCharsRegex.test(req.body[field])) {
    //         valErrs.push({ [field]: 'contains special characters' });
    //     }
    // });

    const leadingSpaceRegex = /^\s+/;
    const requiredFields = ['objective_text', 'id_course'];
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
    if (!onlyDigitsRegex.test(id_objective)) {
        valErrs.push({ id_objective: 'should contain only numeric values' });
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
        const objectiveExists = await objectiveDal.getObjectiveById(id_objective);
        
        if (!objectiveExists) {
            appErr.send(req, res, 'objective_not_found', 'Objective not found');
            return;
        }

        objective = await objectiveDal.updateObjective(id_objective, updateData);
        
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to update objective');
        return;
    }

    res.status(successStatus).json(objective);
};
