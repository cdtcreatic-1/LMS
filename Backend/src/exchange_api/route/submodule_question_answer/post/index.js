const submoduleDal = require('cccommon/dal/submodule');
const questionDal = require('cccommon/dal/submoduleQuestion');
const answerDal = require("cccommon/dal/submoduleAnswer");
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const successStatus = 201;
    const { id_submodule, data } = req.body;
    let valErrs = [];

    if (!id_submodule) {
        valErrs.push({ "id_submodule": 'missing' });
    }

    if (!data || data.length === 0) {
        valErrs.push({ "data": 'should be an array' });
    } else {
        data.forEach(row => {
            if (!Object.keys(row).includes("question_content")) {
                valErrs.push({ "question_content": 'missing' });
            } else {
                row.question_content = row.question_content.trim();
            }

            if (!Object.keys(row).includes("answers")) {
                valErrs.push({ "answers": 'missing' });
            }
        });

        // const maxLengths = { question_content: 500 };
        // const minLengths = { question_content: 20 };
        // const specialCharsRegex = /^[A-Za-z0-9áéíóúÁÉÍÓÚüÜñÑ.,\/\-;:_?!¡\s]*$/;
        // const onlyDigitsRegex = /^\d+$/;

        data.forEach(row => {
            const { question_content } = row;
            const subSummaryRegex = /^[0-9a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s,.\-_\/;:?!]{10,500}$/;
            if (!subSummaryRegex.test(question_content)) {
                valErrs.push({ question_content: 'contains some special characters not allowed' });
            }
            // if (question_content.length > maxLengths.question_content) {
            //     valErrs.push({ question_content: `should not exceed ${maxLengths.question_content} characters` });
            // }
            // if (question_content.length < minLengths.question_content) {
            //     valErrs.push({ question_content: `should have at least ${minLengths.question_content} characters` });
            // }
            // if (specialCharsRegex.test(question_content)) {
            //     valErrs.push({ question_content: 'contains special characters' });
            // }
            // if (onlyDigitsRegex.test(question_content)) {
            //     valErrs.push({ question_content: 'should not be only numeric values' });
            // }
        });

        if (valErrs.length) {
            return appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        }

        try {
            for (let row of data) {
                const { question_content, question_description, answers } = row;

                const submoduleExists = await submoduleDal.getSubmoduleById(id_submodule);
                if (!submoduleExists) {
                    return res.status(400).json({ ok: false, msg: "submodule_not_found - Submodule does not exists" });
                }

                const questionExists = await questionDal.getQuestionByContent(question_content);
                if (questionExists) {
                    return res.status(400).json({ ok: false, msg: "question_exist - Question already exists" });
                }

                const createdQuestion = await questionDal.createQuestion({
                    question_content,
                    question_description,
                    id_submodule
                });

                for (let ans of answers) {
                    const { answers_content, answers_validity } = ans;

                    const answerExists = await answerDal.getAnswerByContent(answers_content);
                    if (answerExists) {
                        return res.status(400).json({ ok: false, msg: "answer_exist - Answer already exists" });
                    }
                    await answerDal.createAnswer({
                        answers_content,
                        answers_validity,
                        id_question: createdQuestion.id_question
                    });
                }
            }

            return res.status(successStatus).json({ ok: true, msg: "Preguntas y Respuestas Registradas Correctamente" });
        } catch (err) {
            appErr.handleRouteServerErr(req, res, err, 'failed to create question');
            return;
        }
    }
};
