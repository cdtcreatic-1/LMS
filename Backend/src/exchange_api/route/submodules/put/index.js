const commonConfig = require('cccommon/config');
const submoduleDal = require('cccommon/dal/submodule');
const moduleDal = require('cccommon/dal/module');
const courseStatusDal = require('cccommon/dal/courseStatus');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const successStatus = 200;

    const {
        id_submodule,
        submodule_title,
        submodule_summary,
        submodule_class_video,
        submodule_status,
        id_module,
    } = req.body;

    let submodule_resources = null;
    if (req.files && req.files.submodule_resources) {
        submodule_resources = req.files.submodule_resources[0].path;
    }

    const valErrs = [];

    let updateData = {};

    if (submodule_title) updateData.submodule_title = submodule_title;
    if (submodule_summary) updateData.submodule_summary = submodule_summary;
    if (submodule_class_video) updateData.submodule_class_video = submodule_class_video;
    if (submodule_resources) updateData.submodule_resources = submodule_resources;
    if (submodule_status) updateData.submodule_status = submodule_status;
    if (id_module) updateData.id_module = id_module;
    updateData.submodule_updated_at = new Date();

    if (!id_submodule) {
        appErr.send(req, res, 'missing_id', 'Submodule ID missing');
        return;
    }

    let requiredFields = [
        'submodule_title',
        'submodule_status',
        'id_module'
    ];

    requiredFields.forEach(field => {
        if (!req.body[field]) {
            valErrs.push({ [field]: 'missing' });
        }
    });

     const linkRegex = /^[0-9a-zA-Z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{5,250}$/;
    if (!linkRegex.test(submodule_class_video)) {
        valErrs.push({ submodule_class_video: 'not url video' });
    }

    const suBmoduleTitleRegex = /^[\wáéíóúÁÉÍÓÚüÜñÑ.,\/\-;:_\s]{12,200}$/;
    if (!suBmoduleTitleRegex.test(submodule_title)) {
        valErrs.push({ submodule_title: 'contains some special characters not allowed' });
    }

    const subSummaryRegex = /^[0-9a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s,.\-_\/;:]{20,500}$/;
    if (!subSummaryRegex.test(submodule_summary)) {
        valErrs.push({ submodule_summary: 'contains some special characters not allowed' });
    }

    const maxPdfSize = 3 * 1024 * 1024; // 3 MB
    if (req.files && req.files.submodule_resources) {
        req.files.submodule_resources.forEach((file, index) => {
            if (file.mimetype !== 'application/pdf') {
                valErrs.push({ submodule_resources: `Only PDF files are allowed for PDF ${index + 1}` });
            } else if (file.size > maxPdfSize) {
                valErrs.push({ submodule_resources: `PDF ${index + 1} size should not exceed 3 MB` });
            }
        });
      }

    // // Validation for character limits
    // const maxLengths = {
    //     submodule_title: 250,
    //     submodule_summary: 500,
    //     submodule_class_video: 250,
    // };
    // const minLengths = {
    //     submodule_title: 5,
    //     submodule_summary: 20,
    //     submodule_class_video: 25,
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

    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};"\\|<>\/?]+/;
    const fieldsToCheckForSpecialChars = [  
        'submodule_status',  
    ];

    fieldsToCheckForSpecialChars.forEach(field => {
        if (req.body[field] && specialCharsRegex.test(req.body[field])) {
            valErrs.push({ [field]: 'contains special characters' });
        }
    });

    // const specialCharsRegexDescription = /[!@#$%^&()_\=\[\]{}'"\\|<>\/]+/;
    // const fieldsToCheckForSpecialCharsDescription = [
    //     'submodule_summary'
    // ];
    // fieldsToCheckForSpecialCharsDescription.forEach(field => {
    //     if (req.body[field] && specialCharsRegexDescription.test(req.body[field])) {
    //         valErrs.push({ [field]: 'contains some special characters not allowed' });
    //     }
    // });

    const leadingSpaceRegex = /^\s+/;
    requiredFields.forEach(field => {
        if (req.body[field] && leadingSpaceRegex.test(req.body[field])) {
            valErrs.push({ [field]: 'starts with excessive whitespace' });
        }
    });

    const onlyDigitsRegex = /^\d+$/; 
    if (onlyDigitsRegex.test(submodule_title)) {
        valErrs.push({ submodule_title: 'should not be only numeric values' });
    }
    if (onlyDigitsRegex.test(submodule_summary)) {
        valErrs.push({ submodule_summary: 'should not be only numeric values' });
    }
    if (!onlyDigitsRegex.test(id_module)) {
        valErrs.push({ id_module: 'should contain only numeric values' });
    }
    if (!onlyDigitsRegex.test(id_submodule)) {
        valErrs.push({ id_submodule: 'should contain only numeric values' });
    }
    const maxImageSize = 3 * 1024 * 1024;
    if (req.files && req.files.submodule_resources && req.files.submodule_resources[0].size > maxImageSize) {
        valErrs.push({ submodule_resources: 'image size or resource should not exceed 3 MB' });
    }

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    try {
        const submoduleExists = await submoduleDal.getSubmoduleById(id_submodule);
        if (!submoduleExists) {
            appErr.send(req, res, 'submodule_not_found', 'Submodule does not exist');
            return;
        }

        const moduleExists = await moduleDal.getModuleById(id_module);
        if (!moduleExists) {
            appErr.send(req, res, 'module_not_found', 'Module does not exist');
            return;
        }

        submodule = await submoduleDal.updateSubmodule(id_submodule, updateData);

    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to update submodule');
        return;
    }

    res.status(successStatus).send({
        message: "Submodule with title: "+submodule.submodule_title+" successfully updated",
        submodule_title: submodule.submodule_title,
        submodule_summary: submodule.submodule_summary,
        submodule_resources: submodule.submodule_resources,
        submodule_status: submodule.submodule_status,
        id_module: submodule.id_module,
        id_submodule: submodule.id_submodule
    });
};
