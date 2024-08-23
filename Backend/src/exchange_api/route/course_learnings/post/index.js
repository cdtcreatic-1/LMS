const commonConfig = require('cccommon/config');
const courseDal = require('cccommon/dal/course');
const appErr = require('this_pkg/error');
const courseLearningDal = require('cccommon/dal/courseLearning'); 

exports.handler = async (req, res) => {
    let learning;

    const successStatus = 201;

    const {
        learning_text,
        id_course
    } = req.body;

    const valErrs = [];
    let requiredFields = ['learning_text', 'id_course'];

    requiredFields.forEach(field => {
        if (!req.body[field]) {
            valErrs.push({ [field]: 'missing' });
        }
    });

    // Validation for character limits
    const maxLengths = {
        learning_text: 500
    };
    const minLengths = {
        learning_text: 10
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

    if (learning_text && specialCharsRegex.test(learning_text)) {
        valErrs.push({ learning_text: 'contains special characters' });
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
    if (onlyDigitsRegex.test(learning_text)) {
        valErrs.push({ learning_text: 'should not be only numeric values' });
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

        learning = await courseLearningDal.createLearning({
            learning_text,
            id_course
        });

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to create course learning');
        return;
    }

    res.status(successStatus).send({
        learning_text: learning.learning_text,
        id_course: learning.id_course,
        id_learning: learning.id_learning
    });
};
