const submoduleAnswerDal = require('cccommon/dal/submoduleAnswer');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const { id_answer } = req.params;

    try {
        const deleted = await submoduleAnswerDal.deleteAnswer(id_answer);
        if (!deleted) {
            return appErr.send(req, res, 'answer_not_found', 'Answer not found');
        }
        res.status(200).send({ message: 'Answer deleted successfully' });
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to delete answer');
    }
};
