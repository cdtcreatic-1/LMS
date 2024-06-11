const models = require('cccommon/models/internaldb');
const moduleDal = require('cccommon/dal/module');
const subModuleDal = require('cccommon/dal/submodule');
const { frontend_host, app_url } = require('cccommon/config');
const { Op } = require('sequelize');


async function createCourse(courseData) {
    try {
        const newCourse = models.Course.build(courseData);
        const savedCourse = await newCourse.save();
        return savedCourse;
    } catch (error) {
        throw new Error(`Error creating course: ${error.message}`);
    }
};

async function getCourseById(id_course) {
    try {
        const course = await models.Course.findOne({
            where: {
                id_course: id_course
            },
        });

        return course;

    } catch (error) {
        throw new Error(`Error getting course by id: ${error.message}`);
    }
};

async function getAllCourses() {
    try {
        const courses = await models.Course.findAll({
            include: [
                {
                    model: models.Module,
                    include: [
                        {
                            model: models.Submodule
                        }
                    ]
                },
                {
                    model: models.CourseObjective
                }
            ]
        });
        console.log({courses})

        for (let i = 0; i < courses.length; i++) {
            const modules = await moduleDal.getModulesByIdCourse(courses[i].id_course);

            if (!modules || modules.length === 0) {
                courses[i].dataValues.Modules = [];
            }

            courses[i].dataValues.Modules = modules
        }


        for (let i = 0; i < courses.length; i++) {
            courses[i].dataValues.submodules = [];
        
            if (courses[i].dataValues.Modules != []) {
                for (let j = 0; j < courses[i].dataValues.Modules.length; j++) {
                    const submodules = await subModuleDal.getSubmodulesByModule(courses[i].dataValues.Modules[j].dataValues.id_module);
        
                    if (submodules && submodules.length !== 0) {
                        courses[i].dataValues.submodules.push(submodules);
                    }
                }
            }
            courses[i].dataValues.submodules = courses[i].dataValues.submodules.flat();
        }

        return courses;
    } catch (error) {
        throw new Error(`Error retrieving all courses: ${error.message}`);
    }
};

async function getAllCoursesbyUser(id_user) {
    try {
        const courses = await models.Course.findAll({
            where: {
                id_user: id_user
            },
        });

        return courses;
    } catch (error) {
        throw new Error(`Error retrieving all courses: ${error.message}`);
    }
};

async function getAllInfoCoursebyUser(id_user) {
    try {
        const userCourses = await models.UserCourse.findAll({
            where: {
                id_user
            },
            include: [{
                model: models.Course,
                include: [
                    {
                        model: models.Module,
                        include: [{
                            model: models.Submodule
                        }]
                    }
                ]
            }]
        });

        const coursesWithDetails = userCourses.map(userCourse => {
            const course = userCourse.Course.dataValues;

            const modules = course.Modules.map(module => {
                const submodules = module.Submodules.map(submodule => {
                    return {
                        ...submodule.dataValues,
                        submodule_resources: submodule.submodule_resources ? app_url() + submodule.submodule_resources : null,
                    };
                });

                return {
                    ...module.dataValues,
                    Submodules: submodules,
                };
            });

            return {
                ...course,
                course_curriculum_file: course.course_curriculum_file ? app_url() + course.course_curriculum_file : null,
                course_photo: course.course_photo ? app_url() + course.course_photo : null,
                Modules: modules,
            };
        });

        return coursesWithDetails;
    } catch (error) {
        console.error(`Error en getAllInfoCoursebyUser: ${error.message}`);
        throw error;
    }
};

async function getAllInfoCoursebyUserAndCourse(id_user, id_course) {
    try {
        const userCourses = await models.UserCourse.findAll({
            where: {
                id_user,
                id_course
            },
            include: [{
                model: models.Course,
                include: [
                    {
                        model: models.Module,
                        include: [{
                            model: models.Submodule,
                            include: [{
                                model: models.UserSubmoduleProgress,
                                where: {
                                    id_user
                                }
                            }]
                        }]
                    }
                ]
            }]
        });

        const coursesWithDetails = userCourses.map(userCourse => {
            const course = userCourse.Course.dataValues;

            const modules = course.Modules.map(module => {
                const submodules = module.Submodules.map(submodule => {
                    return {
                        ...submodule.dataValues,
                        submodule_resources: submodule.submodule_resources ? app_url() + submodule.submodule_resources : null,
                    };
                });

                return {
                    ...module.dataValues,
                    Submodules: submodules,
                };
            });

            return {
                ...course,
                course_curriculum_file: course.course_curriculum_file ? app_url() + course.course_curriculum_file : null,
                course_photo: course.course_photo ? app_url() + course.course_photo : null,
                Modules: modules,
            };
        });

        return coursesWithDetails;
    } catch (error) {
        console.error(`Error en getAllInfoCoursebyUser: ${error.message}`);
        throw error;
    }
};



async function getCourseByTitle(course_title) {
    try {
        const course = await models.Course.findOne({
            where: {
                course_title: course_title
            },
        });

        return course;

    } catch (error) {
        throw new Error(`Error getting course by id: ${error.message}`);
    }
};

async function updateCourse(id_course, courseData) {
    try {
        const course = await models.Course.findByPk(id_course);
        if (!course) {
            throw new Error('Course not found');
        }
        await course.update(courseData);
        return course.toJSON();
    } catch (error) {
        throw new Error(`Error updating course: ${error.message}`);
    }
};

async function deleteCourse(id_course) {
    try {
        const course = await models.Course.findByPk(id_course);
        if (!course) {
            throw new Error('Course not found');
        }
        await course.destroy();
        return true;
    } catch (error) {
        throw new Error(`Error deleting course: ${error.message}`);
    }
};

async function getCoursesByUserSkills(id_user) {
    try {
        const userSkills = await models.UserSkillPreference.findAll({
            where: { id_user },
            attributes: ['id_skill'],
            raw: true,
        });
        const skillIds = userSkills.map(us => us.id_skill);

        if (skillIds.length === 0) {
            return [];
        }

        const courses = await models.Course.findAll({
            include: [
                {
                    model: models.Module,
                    include: [{ model: models.Submodule }]
                },
                { model: models.CourseObjective },
                {
                    model: models.Skill,
                    as: 'Skills',
                    through: { model: models.CourseSkill, attributes: [] },
                    where: { id_skill: skillIds }
                }
            ]
        });
        
        for (let i = 0; i < courses.length; i++) {
            const modules = await moduleDal.getModulesByIdCourse(courses[i].id_course);

            if (!modules || modules.length === 0) {
                courses[i].dataValues.Modules = [];
            }

            courses[i].dataValues.Modules = modules
        }


        for (let i = 0; i < courses.length; i++) {
            courses[i].dataValues.submodules = [];
            if (courses[i].dataValues.Modules != []) {
                for (let j = 0; j < courses[i].dataValues.Modules.length; j++) {
                    const submodules = await subModuleDal.getSubmodulesByModule(courses[i].dataValues.Modules[j].dataValues.id_module);
                    if (submodules && submodules.length !== 0) {
                        courses[i].dataValues.submodules.push(submodules);
                    }
                }
            }
            courses[i].dataValues.submodules = courses[i].dataValues.submodules.flat();
        }
        
        return courses;
    } catch (error) {
        throw new Error(`Error retrieving courses by user skills: ${error.message}`);
    }
}


async function getRecentCourses() {
    const sevenDaysAgo = new Date(new Date() - 14 * 24 * 60 * 60 * 1000);
    try {
        const courses = await models.Course.findAll({
            where: {
                course_created_at: {
                    [Op.gte]: sevenDaysAgo
                }
            },
            include: [
                {
                    model: models.Module,
                    include: [{ model: models.Submodule }]
                },
                { model: models.CourseObjective },
            ]
        });
        console.log(courses);

        for (let i = 0; i < courses.length; i++) {
            const modules = await moduleDal.getModulesByIdCourse(courses[i].id_course);

            if (!modules || modules.length === 0) {
                courses[i].dataValues.Modules = [];
            }

            courses[i].dataValues.Modules = modules
        }


        for (let i = 0; i < courses.length; i++) {
            courses[i].dataValues.submodules = [];
            if (courses[i].dataValues.Modules != []) {
                for (let j = 0; j < courses[i].dataValues.Modules.length; j++) {
                    const submodules = await subModuleDal.getSubmodulesByModule(courses[i].dataValues.Modules[j].dataValues.id_module);
        
                    if (submodules && submodules.length !== 0) {
                        courses[i].dataValues.submodules.push(submodules);
                    }
                }
            }
            courses[i].dataValues.submodules = courses[i].dataValues.submodules.flat();
        }
        
        return courses;

    } catch (error) {
        throw new Error(`Error al recuperar los cursos recientes: ${error.message}`);
    }
}


module.exports = {
    createCourse,
    getCourseById,
    getCourseByTitle,
    getAllCourses,
    updateCourse,
    deleteCourse,
    getCoursesByUserSkills,
    getAllCoursesbyUser,
    getAllInfoCoursebyUser,
    getAllInfoCoursebyUserAndCourse,
    getRecentCourses
};