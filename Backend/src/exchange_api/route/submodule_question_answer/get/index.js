const questionDal = require('cccommon/dal/submoduleQuestion');
const answerDal = require('cccommon/dal/submoduleAnswer');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    let answers = [];
    const id_submodule = Number(req.params.id_submodule);

    if (!id_submodule) {
        appErr.send(req, res, 'validation_error', 'Missing id_submodule');
        return;
    }

    const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (specialCharsRegex.test(req.params.id_submodule)) {
        appErr.send(req, res, 'validation_error', 'id_submodule contains special characters');
        return;
    }

    try {
        const questionsFound = await questionDal.getQuestionByIdSubmodule(id_submodule);

        if (!questionsFound) {
            res.status(400).json({ data: [] });
            return;
        }

        for (let i = 0; i < questionsFound.length; i++) {
            const { id_question } = questionsFound[i];

            const result = await answerDal.getAnswerByIdQuestion(id_question);

            if (!result) {
                continue;
            }

            answers = [...answers, result]
        }

        res.status(200).json({ questions: questionsFound, answers });
    } catch (error) {
        appErr.handleRouteServerErr(req, res, error, 'failed to get question by id');
        return;
    }
};