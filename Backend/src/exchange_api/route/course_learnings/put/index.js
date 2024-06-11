const learningDal = require('cccommon/dal/courseLearning');
const courseDal = require('cccommon/dal/course');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const successStatus = 200;

    const {
        id_learning,
        learning_text,
        id_course
    } = req.body;

    let updateData = {};
    const valErrs = [];

    if (learning_text) updateData.learning_text = learning_text;
    if (id_course) updateData.id_course = id_course;
    if (!id_learning && !id_course && !learning_text) {
        appErr.send(req, res, 'all_fields_missing', 'all fields are missing');
        return;
    }
    if (!id_learning || !id_course) {
        appErr.send(req, res, 'missing_id', 'Learning ID missing');
        return;
    }
    if (!learning_text) {
        appErr.send(req, res, 'input_validation_failed', 'Learning text missing');
        return;
    }

    const maxLengths = {
        learning_text: 500,
        id_course: 10,
    };
    const minLengths = {
        learning_text: 20,
        id_course: 5,
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

    const specialCharsRegex = /[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]+/;
    const fieldsToCheckForSpecialChars = [
        'id_learning',
        'learning_text',
        'id_course'
    ];

    fieldsToCheckForSpecialChars.forEach(field => {
        if (req.body[field] && specialCharsRegex.test(req.body[field])) {
            valErrs.push({ [field]: 'contains special characters' });
        }
    });

    const leadingSpaceRegex = /^\s+/;
    const requiredFields = ['learning_text', 'id_course'];
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
    if (!onlyDigitsRegex.test(id_learning)) {
        valErrs.push({ id_learning: 'should contain only numeric values' });
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
        const learningExists = await learningDal.getLearningById(id_learning);
        
        if (!learningExists) {
            appErr.send(req, res, 'learning_not_found', 'Learning not found');
            return;
        }

        learning = await learningDal.updateLearning(id_learning, updateData);
        
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to update learning');
        return;
    }

    res.status(successStatus).json(learning);
};
