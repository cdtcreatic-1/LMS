const courseObjectiveDal = require('cccommon/dal/courseObjective');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const { id_objective } = req.params;

    try {
        const deleted = await courseObjectiveDal.deleteObjectiveCourse(id_objective);

        if (deleted === false) {
            res.status(404).json({ msg: 'Course Objective not found' });
            return
        }

        //Populate en get Skills que retonre tambien el skill_name

        res.status(200).send({ message: 'Course Objective deleted successfully' });
    } catch (error) {
        appErr.handleRouteServerErr(req, res, error, 'failed to delete Course Objective association');
    }
};
