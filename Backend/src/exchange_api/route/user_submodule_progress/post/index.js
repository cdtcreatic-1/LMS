const userSubmoduleProgressDal = require('cccommon/dal/user_submodule_progress');

exports.handler = async (req, res) => {
    try {
        const progress = await userSubmoduleProgressDal.createUserSubmoduleProgress({
            id_user: req.body.id_user,
            id_submodule: req.body.id_submodule,
            is_completed: req.body.is_completed,
        });
        res.status(201).json(progress);
    } catch (error) {
        appErr.handleRouteServerErr(req, res, error, 'failed to create user submodule progress');
        return;
    }
};
