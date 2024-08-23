const submoduleQuestionnDal = require('cccommon/dal/submoduleQuestion');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const { id_question } = req.params;

    try {
        const deleted = await submoduleQuestionnDal.deleteQuestion(id_question);
        if (!deleted) {
            return appErr.send(req, res, 'question_not_found', 'Question not found');
        }
        res.status(200).send({ message: 'Question deleted successfully' });
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to delete question');
    }
};
