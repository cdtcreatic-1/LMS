const submoduleDal = require('cccommon/dal/submodule');
const questionDal = require('cccommon/dal/submoduleQuestion');
const answerDal = require('cccommon/dal/submoduleAnswer');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const successStatus = 200;

    const {
        id_submodule,
        data
    } = req.body;

    const valErrs = [];

    if (!id_submodule) {
        valErrs.push({ "id_submodule": 'missing' });
    }

    if (!data || data.length === 0) {
        valErrs.push({ "data": 'should be an array' });
    } {

        let updateData = [];

        data.forEach(q => {
            const { id_question, question_content, /*question_description*/ } = q;

            let updateInfo = {};

            if (id_question) {
                updateInfo.id_question = id_question;
            }

            if (question_content) {
                updateInfo.question_content = question_content;
            }

            /*if (question_description) {
                updateInfo.question_description = question_description;
            }*/

            updateData.push(updateInfo);
        })


        data.forEach(row => {
            if (!Object.keys(row).includes("question_content")) {
                valErrs.push({ "question_content": 'missing' });
            }

            /*if (!Object.keys(row).includes("question_description")) {
                valErrs.push({ "question_description": 'missing' });
            }*/

            if (!Object.keys(row).includes("answers")) {
                valErrs.push({ "answers": 'missing' });
            }
        })

        const maxLengths = {
            question_content: 500
        };
        const minLengths = {
            question_content: 5
        };

        data.forEach(row => {
            const { question_content } = row;

            if (question_content && question_content.length > maxLengths[question_content]) {
                valErrs.push({ [question_content]: `should not exceed ${maxLengths[question_content]} characters` });
            }

            if (question_content && question_content.length < minLengths[question_content]) {
                valErrs.push({ [question_content]: `should have at least ${minLengths[question_content]} characters` });
            }

        })


        data.forEach(row => {
            const { question_content } = row;
            const subSummaryRegex = /^[0-9a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s,.\-_\/;:?!]{10,500}$/;
            if (!subSummaryRegex.test(question_content)) {
                valErrs.push({ question_content: 'contains some special characters not allowed 10' });
            }
        })

        // const leadingSpaceRegex = /^\s+/;
        // data.forEach(row => {
        //     const { question_content } = row;

        //     if (question_content && leadingSpaceRegex.test(question_content)) {
        //         valErrs.push({ [question_content]: 'starts with excessive whitespace' });
        //     }

        // });

        // const onlyDigitsRegex = /^\d+$/;

        // data.forEach(row => {
        //     const { question_content } = row;

        //     if (onlyDigitsRegex.test(question_content)) {
        //         valErrs.push({ question_content: 'should not be only numeric values' });
        //     }
        // })


        if (valErrs.length) {
            appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
            return;
        }

        try {

            data.forEach((row, i) => {
                const { id_question, question_content, /*question_description,*/ answers } = row;

                async function update() {
                    const submoduleExists = await submoduleDal.getSubmoduleById(id_submodule);
                    if (!submoduleExists) {
                        appErr.send(req, res, 'submodule_not_found', 'Submodule does not exists');
                        return;
                    }

                    if (id_question === 0) {
                        const { id_question: id_question2 } = await questionDal.

                            createQuestion({
                                question_content,
                                //question_description,
                                id_submodule
                            });

                        answers.forEach(ans => {

                            const { answers_content, answers_validity } = ans;

                            async function saveAns() {
                                const questionExists = await questionDal.getQuestionById(id_question2);
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
                                    id_question: id_question2
                                });
                            }

                            saveAns()

                        })
                    } else {

                        const questionExists = await questionDal.getQuestionById(id_question);

                        if (!questionExists) {
                            appErr.send(req, res, 'question_not_found', 'Question not found');
                            return;
                        }

                        await questionDal.updateQuestion(id_question, updateData[i]);

                        answers.forEach((ans) => {

                            const { id_answer, answers_content, answers_validity } = ans;

                            async function saveAns() {
                                const questionExists = await questionDal.getQuestionById(id_question);
                                if (!questionExists) {
                                    return res.status(400).json({ ok: true, msg: "question_not_found - Question does not exist" });;
                                }

                                if (id_answer === 0) {
                                    await answerDal.createAnswer({
                                        answers_content,
                                        answers_validity,
                                        id_question
                                    });
                                } else {

                                    const answerExists = await answerDal.getAnswerById(id_answer);
                                    if (!answerExists) {
                                        return res.status(400).json({ ok: true, msg: "answer_not_found - Answer not found" });;
                                    }

                                    await answerDal.updateAnswer(id_answer, { answers_content, answers_validity });
                                }
                            }

                            saveAns()

                        })
                    }
                }

                update()
            })

            res.status(successStatus).send({ ok: true, msg: "Updated Succesfully" });
        } catch (err) {
            appErr.handleRouteServerErr(req, res, err, 'failed to update question');
            return;
        }


    }
};
