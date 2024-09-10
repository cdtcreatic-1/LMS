const moduleDal = require('cccommon/dal/module');
const courseDal = require('cccommon/dal/course');
const courseStatusDal = require('cccommon/dal/courseStatus');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    let module;
    const successStatus = 201;

    const {
        module_title,
        module_description,
        module_status,
        id_course
    } = req.body;

    const valErrs = [];

    let requiredFields = [
        'module_title',
        'module_status',
        'id_course'
    ];

    requiredFields.forEach(field => {
        if (!req.body[field]) {
            valErrs.push(`${field} faltante`);
        }
    });

    
    const moduleTitleRegex = /^[\wáéíóúÁÉÍÓÚüÜñÑ.,\/\-:;'"¡¿\s]{9,200}$/;
    if (!moduleTitleRegex.test(module_title)) {
        valErrs.push({ module_title: 'contains some special characters not allowed' });
    }

    const moduleStatusRegex = /^[\wáéíóúÁÉÍÓÚüÜñÑ.,\/\-;:_\s]{20,500}$/;
    if (!moduleStatusRegex.test(module_description)) {
        valErrs.push({ module_description: 'contains some special characters not allowed' });
    }

    // if (req.files && req.files.farm_documentation_chamber_commerce) {
    //     req.files.farm_documentation_chamber_commerce.forEach((file, index) => {
    //         if (file.mimetype !== 'application/pdf') {
    //             validationErrors.push({ farm_documentation_chamber_commerce: `Only PDF files are allowed for PDF ${index + 1}` });
    //         } else if (file.size > maxPdfSiz) {
    //             validationErrors.push({ farm_documentation_chamber_commerce: `PDF ${index + 1} size should not exceed 3 MB` });
    //         }
    //     });
    //   }

    // const maxLengths = {
    //     module_title: 250,
    //     module_description: 500
    // };
    // const minLengths = {
    //     module_title: 5,
    //     module_description: 20
    // };

    // for (const field in maxLengths) {
    //     if (req.body[field] && req.body[field].length > maxLengths[field]) {
    //         valErrs.push(`${field} no debe pasar de ${maxLengths[field]} caracteres`);
    //     }
    // }

    // for (const field in minLengths) {
    //     if (req.body[field] && req.body[field].length < minLengths[field]) {
    //         valErrs.push(`${field} debe tener al menos ${minLengths[field]} caracteres`);
    //     }
    // }

    // const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};"\\|<>\/?]+/;

    // const specialCharsRegexDescription = /[^(?!.*(\d)\1{5,})[a-zA-Z0-9áéíóúÁÉÍÓÚüÜ.%!¡¿?ñÑ,\s]*$]+/;
    // const fieldsToCheckForSpecialCharsDescription = [
    //     'module_title',
    //     'module_description'
    // ];
    // fieldsToCheckForSpecialCharsDescription.forEach(field => {
    //     if (req.body[field] && specialCharsRegexDescription.test(req.body[field])) {
    //         valErrs.push(`${field} contiene algunos caracteres especiales no permitidos`);
    //     }
    // });

    // if (id_course && specialCharsRegex.test(id_course)) {
    //     valErrs.push(`${id_course}: contiene algunos caracteres especiales`);
    // }
    // if (module_status && specialCharsRegex.test(module_status)) {
    //     valErrs.push(`${module_status}: contiene caracteres especiales`);
    // }

    const leadingSpaceRegex = /^\s+/;
    requiredFields.forEach(field => {
        if (req.body[field] && leadingSpaceRegex.test(req.body[field])) {
            valErrs.push(`${field}: inicia con muchos espacios en blanco`);
        }
    });

    // const onlyDigitsRegex = /^\d+$/;
    // if (onlyDigitsRegex.test(module_title)) {
    //     valErrs.push({ module_title: 'should not be only numeric values' });
    // }
    // if (onlyDigitsRegex.test(module_description)) {
    //     valErrs.push({ module_description: 'should not be only numeric values' });
    // }
    // if (!onlyDigitsRegex.test(id_course)) {
    //     valErrs.push({ id_course: 'should contain only numeric values' });
    // }

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    try {
        const moduleExists = await moduleDal.getModuleByTitle(module_title);

        if (moduleExists) {
            appErr.send(req, res, 'module_exist', 'Module already exists');
            return;
        }

        const courseExists = await courseDal.getCourseById(id_course);

        if (!courseExists) {
            appErr.send(req, res, 'course_not_found', 'Course not found');
            return;
        }

        module = await moduleDal.createModule({
            module_title,
            module_description,
            module_status,
            id_course
        });

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to create module');
        return;
    }

    res.status(successStatus).send({
        module_title: module.module_title,
        module_description: module.module_description,
        module_status: module.module_status,
        id_course: module.id_course,
        id_module: module.id_module
    });
};
