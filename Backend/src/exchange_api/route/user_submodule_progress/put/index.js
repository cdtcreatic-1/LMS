const userSubmoduleProgressDal = require('cccommon/dal/user_submodule_progress');

exports.handler = async (req, res) => {
    const id = req.body.id;

    try {
        const updatedProgress = await userSubmoduleProgressDal.updateUserSubmoduleProgress(id, {
            is_completed: req.body.is_completed,
        });
        res.json(updatedProgress);
    } catch (error) {
        appErr.handleRouteServerErr(req, res, error, 'failed to create user submodule progress');
        return;
    }
};
