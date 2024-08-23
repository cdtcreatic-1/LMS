const submoduleDal = require('cccommon/dal/submodule');
const questionDal = require('cccommon/dal/submoduleQuestion');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const successStatus = 200;
    
    const {
        id_question,
        question_content,
        id_submodule
    } = req.body;

    const valErrs = [];
    let updateData = {};

    if (question_content) updateData.question_content = question_content;
    if (id_submodule) updateData.id_submodule = id_submodule;

    let requiredFields = [
        'id_question',
        'question_content'
    ];

    requiredFields.forEach(field => {
        if (!req.body[field]) {
            valErrs.push({ [field]: 'missing' });
        }
    });

    const maxLengths = {
        question_content: 500
    };
    const minLengths = {
        question_content: 5
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
    if (req.body['question_content'] && specialCharsRegex.test(req.body['question_content'])) {
        valErrs.push({ 'question_content': 'contains special characters' });
    }

    const leadingSpaceRegex = /^\s+/;
    requiredFields.forEach(field => {
        if (req.body[field] && leadingSpaceRegex.test(req.body[field])) {
            valErrs.push({ [field]: 'starts with excessive whitespace' });
        }
    });

    const onlyDigitsRegex = /^\d+$/;
    if (onlyDigitsRegex.test(question_content)) {
        valErrs.push({ question_content: 'should not be only numeric values' });
    }
    if (!onlyDigitsRegex.test(id_question)) {
        valErrs.push({ id_question: 'should contain only numeric values' });
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
            appErr.send(req, res, 'submodule_not_found', 'Submodule does not exists');
            return;
        }
        const questionExists = await questionDal.getQuestionById(id_question);
        if (!questionExists) {
            appErr.send(req, res, 'question_not_found', 'Question not found');
            return;
        }

        question = await questionDal.updateQuestion(id_question, updateData);
        
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to update question');
        return;
    }

    res.status(successStatus).send(question);
};
