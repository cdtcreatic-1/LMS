const commonConfig = require('cccommon/config');
const moduleDal = require('cccommon/dal/module');
const courseDal = require('cccommon/dal/course');
const courseStatusDal = require('cccommon/dal/courseStatus');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const successStatus = 200;

    const {
        id_module,
        module_title,
        module_description,
        module_status,
        id_course
    } = req.body;

    const valErrs = [];

    let updateData = {};

    if (module_title) updateData.module_title = module_title;
    if (module_description) updateData.module_description = module_description;
    if (module_status) updateData.module_status = module_status;
    if (id_course) updateData.id_course = id_course;
    updateData.module_updated_at = new Date();

    if (!id_module) {
        appErr.send(req, res, 'missing_id', 'Module ID missing');
        return;
    }

    let requiredFields = [
        'module_title',
        'module_status',
        'id_course'
    ];

    requiredFields.forEach(field => {
        if (!req.body[field]) {
            valErrs.push({ [field]: 'missing' });
        }
    });

    // Validation for character limits
    const maxLengths = {
        module_title: 100,
        module_description: 500
    };
    const minLengths = {
        module_title: 10,
        module_description: 20
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
        'id_module',
        'module_status',
        'id_course'
    ];
      
    const specialCharsRegexDescription = /[!@#$%^&()_\=\[\]{}'"\\|<>\/]+/;
    const fieldsToCheckForSpecialCharsDescription = [
        'module_title',
        'module_description'
    ];
    fieldsToCheckForSpecialCharsDescription.forEach(field => {
        if (req.body[field] && specialCharsRegexDescription.test(req.body[field])) {
            valErrs.push({ [field]: 'contains some special characters not allowed' });
        }
    });

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
    if (onlyDigitsRegex.test(module_title)) {
        valErrs.push({ module_title: 'should not be only numeric values' });
    }
    if (onlyDigitsRegex.test(module_description)) {
        valErrs.push({ module_description: 'should not be only numeric values' });
    }
    if (!onlyDigitsRegex.test(id_module)) {
        valErrs.push({ id_module: 'should contain only numeric values' });
    }
    if (!onlyDigitsRegex.test(id_course)) {
        valErrs.push({ id_course: 'should contain only numeric values' });
    }
 
    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    try {
        const moduleExists = await moduleDal.getModuleById(id_module);
        if (!moduleExists) {
            appErr.send(req, res, 'module_not_found', 'Module does not exist');
            return;
        }
        const courseExists = await courseDal.getCourseById(id_course);

        if (!courseExists) {
            appErr.send(req, res, 'course_not_found', 'Course not found');
            return;
        }

        module = await moduleDal.updateModule(id_module, updateData);
        
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to update module');
        return;
    }

    res.status(successStatus).send({
        message: "Module with title: "+module.module_title+" successfully updated",
        module_title: module.module_title,
        module_description: module.module_description,
        module_status: module.module_status,
        id_course: module.id_course,
        id_module: module.id_module
    });
};
