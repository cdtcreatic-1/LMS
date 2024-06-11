const courseDal = require('cccommon/dal/course');
const userDal = require('cccommon/dal/user');
const appErr = require('this_pkg/error');
const { frontend_host, app_url } = require('cccommon/config');

exports.handler = async (req, res) => {
    const id_user = req.params.id_user;
    const id_course = req.params.id_course;

    if (!id_user) {
        appErr.send(req, res, "validation_error", "Missing id_user");
        return;
    }

    if (!id_course) {
        appErr.send(req, res, "validation_error", "Missing id_course");
        return;
    }

    try {
        const userExists = await userDal.getUserByIdUser(id_user);
        if (!userExists) {
            appErr.send(req, res, 'user_not_found', 'User not found');
            return;
        }

        const course = await courseDal.getAllInfoCoursebyUserAndCourse(id_user, id_course);
        if (!course) {
            appErr.send(req, res, 'course_not_found', 'No courses found');
            return;
        }

        const coursesValidated = course[0].Modules.map((module, j) => {
            let arrSubmod = [];
            const { Submodules } = module;

            Submodules.sort((a, b) => a.id_submodule - b.id_submodule);

            for (let i = 0; i < Submodules.length; i++) {

                //El primer submodulo del primer modulo siempre estará habilitiado
                if (i === 0 && j === 0) {
                    Submodules[i].is_enabled = true;
                }

                //Si el submodulo no es el inicial, es false, y cambia si y solo si el submodulo inmediatamente anterior ha sido completado
                if (i !== 0) {
                    Submodules[i].is_enabled = false;
                    //Si el progreso del submodulo es mayor o igual a 70, se habilita
                    if (Submodules[i - 1].UserSubmoduleProgress.success_rate >= 70 && Submodules[i - 1].is_enabled === true) {
                        Submodules[i].is_enabled = true;
                    }
                }

                //Si el modulo no es el inicial
                if (j !== 0) {
                    Submodules[i].is_enabled = false;

                    const last = (course[0].Modules[j - 1].Submodules.length) - 1;

                    if (course[0].Modules[j - 1].Submodules[last].is_enabled && course[0].Modules[j - 1].Submodules[last].UserSubmoduleProgress.success_rate >= 70 && i === 0) {
                        Submodules[i].is_enabled = true;
                    }

                    if (i !== 0) {
                        if (Submodules[i - 1].UserSubmoduleProgress.success_rate >= 70 && Submodules[i - 1].is_enabled === true) {
                            Submodules[i].is_enabled = true;
                        }
                    }
                }

                arrSubmod.push(Submodules[i]);
            }

            module.Submodules = arrSubmod

            course[0].Modules[j] = module;

            return course[0]
        })

        res.status(200).json(coursesValidated[0]);
    } catch (error) {
        appErr.handleRouteServerErr(req, res, error, 'failed to get course');
        return;
    }
};