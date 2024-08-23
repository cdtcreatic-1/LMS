const userSubmoduleProgressDal = require('cccommon/dal/user_submodule_progress');

exports.handler = async (req, res) => {
    const id = req.params.id;

    try {
        const progress = await userSubmoduleProgressDal.getUserSubmoduleProgressById(id);
        if (!progress) {
            return res.status(404).send('Progress not found');
        }
        res.json(progress);
    } catch (error) {
        appErr.handleRouteServerErr(req, res, error, 'failed to create user submodule progress');
        return;
    }
};
