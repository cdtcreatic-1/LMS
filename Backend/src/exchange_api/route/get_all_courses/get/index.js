const courseDal = require('cccommon/dal/course');
const purchaseCourseDal = require('cccommon/dal/purchase_course');
const moduleDal = require('cccommon/dal/module');
const subModuleDal = require('cccommon/dal/submodule');
const appErr = require('this_pkg/error');
const { frontend_host, app_url } = require('cccommon/config');

exports.handler = async (req, res) => {
    try {
        const { id_user } = req.params;
        const id_buyer = id_user

        let resultadoCourses = [];
        const courses = await courseDal.getAllCourses();
        const userCourses = await purchaseCourseDal.getPurchasesCoursesByIdBuyer(id_buyer);

        if (courses.length === 0) {
            return res.status(200).json([]);
        }

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
        appErr.handleRouteServerErr(req, res, error, 'failed to get courses');
        return;
    }
};