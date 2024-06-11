const answerDal = require('cccommon/dal/submoduleAnswer');
const questionDal = require('cccommon/dal/submoduleQuestion');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const successStatus = 201;

    const { id_question, data } = req.body;

    let valErrs = [];

    if (!id_question) {
        valErrs.push({ "id_question": 'missing' });
    }

    if (!data || data.length === 0) {
        valErrs.push({ "data": 'should be an array' });
    } else {

        data.forEach(row => {
            if (!Object.keys(row).includes("answers_content")) {
                valErrs.push({ "answers_content": 'missing' });
            }

            if (!Object.keys(row).includes("answers_validity")) {
                valErrs.push({ "answers_validity": 'missing' });
            }

            if (typeof row.answers_validity !== 'boolean') {
                valErrs.push({ answers_validity: 'missing or not a boolean' });
            }
        })

        // Validation for character limits
        const maxLengths = {
            answers_content: 250,
        };
        const minLengths = {
            answers_content: 25,
        };

        data.forEach(row => {
            const { answers_content } = row;

            if (answers_content && answers_content.length > maxLengths[answers_content]) {
                valErrs.push({ [answers_content]: `should not exceed ${maxLengths[answers_content]} characters` });
            }

            if (answers_content && answers_content.length < minLengths[answers_content]) {
                valErrs.push({ [answers_content]: `should have at least ${minLengths[answers_content]} characters` });
            }

        })

        const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

        data.forEach(row => {
            const { answers_content } = row;

            if (answers_content && specialCharsRegex.test(answers_content)) {
                valErrs.push({ answers_content: 'contains special characters' });
            }
        })

        const leadingSpaceRegex = /^\s+/;
        data.forEach(row => {
            const { answers_content } = row;

            if (answers_content && leadingSpaceRegex.test(answers_content)) {
                valErrs.push({ [answers_content]: 'starts with excessive whitespace' });
            }

        });

        const onlyDigitsRegex = /^\d+$/;

        data.forEach(row => {
            const { answers_content } = row;

            if (onlyDigitsRegex.test(answers_content)) {
                valErrs.push({ answers_content: 'should not be only numeric values' });
            }
        })

        if (valErrs.length) {
            appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
            return;
        }

        try {
            data.forEach(row => {

                const { answers_content, answers_validity } = row;

                async function save() {
                    const questionExists = await questionDal.getQuestionById(id_question);
                    if (!questionExists) {
                        return res.status(400).json({ ok: true, msg: "question_not_found - Question does not exist" });;
                    }

                    const answerExists = await answerDal.getAnswerByContent(answers_content);
                    if (answerExists) {
                        return res.status(400).json({ ok: true, msg: "answer_exist - Answer already exists" });;
                    }

                    await answerDal.createAnswer({
                        answers_content,
                        answers_validity,
                        id_question
                    });
                }

                save()

            })

        } catch (err) {
            return res.status(400).json({ ok: true, msg: "failed to create answer" });;
        }

        res.status(successStatus).json({ ok: true, msg: "Respuestas Registradas Correctamente" });
    }
};
