const userCourseDal = require('cccommon/dal/user_course');
const appErr = require('this_pkg/error');

exports.handler = async (req, res) => {
    const { id_user } = req.params;
    try {
        let canContinue = true;
        let submodule;
        let arrCourses = [];

        const data = await userCourseDal.getUserCourses(id_user);
        if (!data) {
            return res.status(404).send({ message: 'Courses for user not found' });
        }

        data.forEach(d => {
            const { Course } = d;

            const { Modules } = Course;
            Modules.forEach(m => {
                const { Submodules } = m;

                Submodules.forEach(s => {
                    if (canContinue) {
                        if (s.UserSubmoduleProgress.is_completed === false) {
                            submodule = s;
                            canContinue = false;
                            return;
                        }
                    }

                    submodule = Submodules[0]
                })

            });
        })

        arrCourses = data.map(d => {
            return {
                ...d,
                submodule
            }
        })

        res.status(200).send({
            message: 'Courses for user retrieved successfully',
            data: arrCourses
        });
    } catch (err) {
        appErr.handleRouteServerErr(req, res, err, 'failed to retrieve courses for user');
    }
};
