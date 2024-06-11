const evaluationDal = require('cccommon/dal/submoduleEvaluation');
const questionDal = require('cccommon/dal/submoduleQuestion');
const answerDal = require('cccommon/dal/submoduleAnswer');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const successStatus = 200;
    
    const {
        id_answer,
        answers_content,
        answers_validity,
        id_question
    } = req.body;

    const valErrs = [];
    let updateData = {};

    if (answers_content) updateData.answers_content = answers_content;
    if (typeof answers_validity === 'boolean') {
        updateData.answers_validity = answers_validity;
    } else {
        valErrs.push({ 'answers_validity': 'should be true or false' });
    }    
    if (id_question) updateData.id_question = id_question;

    let requiredFields = [
        'id_answer',
        'answers_content',
        'id_question'
    ];

    requiredFields.forEach(field => {
        if (!req.body[field]) {
            valErrs.push({ [field]: 'missing' });
        }
    });

    if (typeof answers_validity !== 'boolean') {
        valErrs.push({ answers_validity: 'missing or not a boolean' });
    }

    const maxLengths = {
        answers_content: 250
    };
    const minLengths = {
        answers_content: 25
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
        'answers_content'
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
    if (!onlyDigitsRegex.test(id_answer)) {
        valErrs.push({ id_answer: 'should contain only numeric values' });
    }
    if (!onlyDigitsRegex.test(id_question)) {
        valErrs.push({ id_question: 'should contain only numeric values' });
    }

    if (valErrs.length) {
        appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        return;
    }

    try {
        const questionExists = await questionDal.getQuestionById(id_question);
        if (!questionExists) {
            appErr.send(req, res, 'question_not_found', 'Question not found');
            return;
        }
        const answerExists = await answerDal.getAnswerById(id_answer);
        if (!answerExists) {
            appErr.send(req, res, 'answer_not_found', 'Answer does not exist');
            return;
        }

        answer = await answerDal.updateAnswer(id_answer, updateData);
        question = await questionDal.updateQuestion(id_question, updateData);
        
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to update');
        return;
    }

    res.status(successStatus).send({answer, question});
};
