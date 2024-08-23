const questionDal = require('cccommon/dal/submoduleQuestion');
const submoduleDal = require('cccommon/dal/submodule');
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
            }
        });

        // Validation for character limits
        const maxLengths = {
            question_content: 250,
        };
        const minLengths = {
            question_content: 5,
        };

        const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        const onlyDigitsRegex = /^\d+$/;

        data.forEach(row => {
            let { question_content } = row;
            question_content = question_content.trim();
            row.question_content = question_content;

            if (question_content.length > maxLengths["question_content"]) {
                valErrs.push({ question_content: `should not exceed ${maxLengths["question_content"]} characters` });
            }
            if (question_content.length < minLengths["question_content"]) {
                valErrs.push({ question_content: `should have at least ${minLengths["question_content"]} characters` });
            }
            if (specialCharsRegex.test(question_content)) {
                valErrs.push({ question_content: 'contains special characters' });
            }
            if (onlyDigitsRegex.test(question_content)) {
                valErrs.push({ question_content: 'should not be only numeric values' });
            }
        });

        if (valErrs.length) {
            return appErr.send(req, res, 'validation_error', appErr.mergeValErrLists(valErrs));
        }

        try {
            await Promise.all(data.map(async row => {
                const { question_content } = row;

                const submoduleExists = await submoduleDal.getSubmoduleById(id_submodule);
                if (!submoduleExists) {
                    throw new Error('Submodule does not exist');
                }

                const questionExists = await questionDal.getQuestionByContent(question_content);
                if (questionExists) {
                    throw new Error('Question already exists');
                }

                await questionDal.createQuestion({
                    question_content,
                    id_submodule
                });
            }));
        } catch (err) {
            return appErr.handleRouteServerErr(req, res, err, 'failed to create question');
        }

        res.status(successStatus).json({ ok: true, msg: "Preguntas Registradas Correctamente" });
    }
};