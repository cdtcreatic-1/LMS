const submoduleEvaluationDal = require('cccommon/dal/submoduleEvaluation');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const { id_evaluation } = req.params;

    try {
        const deleted = await submoduleEvaluationDal.deleteEvaluation(id_evaluation);
        if (!deleted) {
            return appErr.send(req, res, 'evaluation_not_found', 'Evaluation not found');
        }
        res.status(200).send({ message: 'Evaluation deleted successfully' });
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to delete evaluation');
    }
};
