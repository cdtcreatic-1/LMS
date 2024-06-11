const skillDal = require('cccommon/dal/skill');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const { skill_name, skill_description } = req.body;

    const valErrs = [];

    const containsLetterRegex = /[a-zA-Z]/;
    if (!containsLetterRegex.test(skill_name)) {
        valErrs.push({ skill_name: 'should contain at least one letter' });
    }
    if (!containsLetterRegex.test(skill_description)) {
        valErrs.push({ skill_description: 'should contain at least one letter' });
    }

    const maxLengths = {
        skill_name: 100,
        skill_description: 1500
    };
    const minLengths = {
        skill_name: 10,
        skill_description: 20
    };

    let requiredFields = [
        'skill_name',
        'skill_description',
    ];

    requiredFields.forEach(field => {
        if (!req.body[field]) {
            valErrs.push({ [field]: 'missing' });
        }
    });

    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    const fieldsToCheckForSpecialChars = [
        'skill_name',
        'skill_description'
    ];
    fieldsToCheckForSpecialChars.forEach(field => {
        if (req.body[field] && specialCharsRegex.test(req.body[field])) {
            valErrs.push({ [field]: 'contains special characters' });
        }
    });

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

    try {
        const skill = await skillDal.createSkill({ skill_name, skill_description });
        res.status(201).send({
            message: 'Skill created successfully',
            skill
        });
    } catch (error) {
        appErr.handleRouteServerErr(req, res, error, 'failed to create skill');
    }
};
