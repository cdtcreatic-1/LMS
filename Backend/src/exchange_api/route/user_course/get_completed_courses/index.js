const userCourseDal = require('cccommon/dal/user_course');
const purchaseCourseDal = require('cccommon/dal/purchase_course');
const userDal = require('cccommon/dal/user');
const appErr = require('this_pkg/error');
const { app_url } = require('cccommon/config');

exports.handler = async (req, res) => {
    const id_user = req.params.id_user;

    if (!id_user || !/^\d+$/.test(id_user)) {
        return res.status(400).send({ message: 'ID del usuario inválido. El id debe ser un valor númerico.' });
    }
    let resultadoCourses = [];

    try {

        const userExist = await userDal.getUserByIdUser(id_user);
        if (!userExist) {
            return res.status(404).send({ message: 'User not found' });
        }

        const coursesExist = await userCourseDal.getUserCourses(id_user);
        if (!coursesExist) {
            return res.status(404).send({ message: 'Courses for user not found' });
        }

        const courses = await userCourseDal.getCompletedCourses(id_user);
        if (courses.length === 0) {
            return res.status(200).json([]);
        }

        const userCourses = await purchaseCourseDal.getPurchasesCoursesByIdBuyer(id_user);

        for (let i = 0; i < courses.length; i++) {
            if (userCourses.length !== 0) {
                for (let j = 0; j < userCourses.length; j++) {

                    if (courses[i].id_course === userCourses[j].id_course) {
                        courses[i].dataValues.is_purchasable = false;
                    } else {
                        courses[i].dataValues.is_purchasable = true;
                    }

                }
            } else {
                courses[i].dataValues.is_purchasable = true;
            }
        }

        for (let i = 0; i < courses.length; i++) {
            if (courses[i].dataValues.Modules.length !== 0 && courses[i].dataValues.submodules.length !== 0) {
                resultadoCourses.push(courses[i]);
            }
        }

        let found = false;
        let lst_sub = undefined;
        const coursesWithPhotos = resultadoCourses.map(course => {
            if (Array.isArray(course.dataValues.submodules)) {
                course.dataValues.submodules.forEach(submdls => {
                    if (Array.isArray(submdls)) {
                        submdls.forEach(submd => {
                            if (!found && submd.UserSubmoduleProgress && !submd.UserSubmoduleProgress.is_completed) {
                                found = true;
                                lst_sub = submd;
                            }
                        });
                    }
                });
            }
        
            if (course.course_photo) {
                if (found) {
                    return {
                        ...course.dataValues,
                        submodules: [lst_sub],
                        course_curriculum_file: app_url() + course.course_curriculum_file,
                        course_photo: app_url() + course.course_photo
                    };
                } else {
                    return {
                        ...course.dataValues,
                        course_curriculum_file: app_url() + course.course_curriculum_file,
                        course_photo: app_url() + course.course_photo
                    };
                }
            } else {
                if (found) {
                    return {
                        ...course.dataValues,
                        submodules: [lst_sub],
                        course_photo: null
                    };
                } else {
                    return {
                        ...course.dataValues,
                        submodules: course.dataValues.submodules[0],
                        course_photo: null
                    };
                }
            }
        });

        res.status(200).json(coursesWithPhotos);
    } catch (error) {
        appErr.handleRouteServerErr(req, res, error, 'failed to get completed courses');
    }
};