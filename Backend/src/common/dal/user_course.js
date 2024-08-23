'use strict';

const models = require('cccommon/models/internaldb');
const moduleDal = require('cccommon/dal/module');
const subModuleDal = require('cccommon/dal/submodule');
const { app_url } = require('cccommon/config');
const { Op, Sequelize } = require('sequelize');


async function createUserCourse(userCourseData) {
    console.log({ userCourseData })
    try {
        const newUserCourse = models.UserCourse.build(userCourseData);
        const savedUserCourse = await newUserCourse.save();
        return savedUserCourse;
    } catch (error) {
        throw new Error(`Error creating user course: ${error.message}`);
    }
}

async function getUserCourse(id_user, id_course) {
    try {
        const userCourse = await models.UserCourse.findOne({
            where: {
                id_user: id_user,
                id_course: id_course
            },
        });
        return userCourse;
    } catch (error) {
        throw new Error(`Error getting user course by user ID and course ID: ${error.message}`);
    }
}

async function getAllUserCourses() {
    try {
        const userCourses = await models.UserCourse.findAll();
        return userCourses;
    } catch (error) {
        throw new Error(`Error retrieving all user courses: ${error.message}`);
    }
}

async function updateUserCourse(id_user, id_course, updateData) {
    try {
        const userCourse = await models.UserCourse.findOne({
            where: {
                id_user: id_user,
                id_course: id_course
            },
        });
        if (!userCourse) {
            throw new Error('User course not found');
        }
        await userCourse.update(updateData);
        return userCourse;
    } catch (error) {
        throw new Error(`Error updating user course: ${error.message}`);
    }
}

async function deleteUserCourse(id_user, id_course) {
    try {
        const userCourse = await models.UserCourse.findOne({
            where: {
                id_user: id_user,
                id_course: id_course
            },
        });
        if (!userCourse) {
            throw new Error('User course not found');
        }
        await userCourse.destroy();
        return true;
    } catch (error) {
        throw new Error(`Error deleting user course: ${error.message}`);
    }
}

async function updateUserCourseScore(id_user, id_course, score) {
    try {
        const userCourse = await models.UserCourse.findOne({
            where: {
                id_user: id_user,
                id_course: id_course
            },
        });
        if (!userCourse) {
            throw new Error('User course not found');
        }
        await userCourse.update({ score });
        return userCourse;
    } catch (error) {
        throw new Error(`Error updating user course score: ${error.message}`);
    }
}

async function updateUserCourseCertificate(id_user, id_course, certificate_description) {
    try {
        const userCourse = await models.UserCourse.findOne({
            where: {
                id_user: id_user,
                id_course: id_course
            },
        });
        if (!userCourse) {
            throw new Error('User course not found');
        }
        await userCourse.update({ certificate_description });
        return userCourse;
    } catch (error) {
        throw new Error(`Error updating user course certificate description: ${error.message}`);
    }
}

async function getUserCourseScore(id_user, id_course) {
    try {
        const userCourse = await models.UserCourse.findOne({
            where: {
                id_user: id_user,
                id_course: id_course
            },
            attributes: ['score'],
        });
        if (!userCourse) {
            throw new Error('User course not found');
        }
        return userCourse;
    } catch (error) {
        throw new Error(`Error getting user course score: ${error.message}`);
    }
}

async function getUserCourseCertificate(id_user, id_course) {
    try {
        const userCourse = await models.UserCourse.findOne({
            where: {
                id_user: id_user,
                id_course: id_course
            },
            attributes: ['certificate_description'],
        });
        if (!userCourse) {
            throw new Error('User course not found');
        }
        return userCourse;
    } catch (error) {
        throw new Error(`Error getting user course certificate description: ${error.message}`);
    }
}

async function getUserCourses(id_user) {
    try {
        const userCourses = await models.UserCourse.findAll({
            where: { id_user: id_user },
            include: [{
                model: models.Course,
                required: true,
                include: [
                    {
                        model: models.Module,
                        include: [
                            {
                                model: models.Submodule,
                                include:[
                                    {
                                        model: models.UserSubmoduleProgress
                                    }
                                ]
                            }
                        ]
                    },
                ]
            }]
        });

        const modifiedUserCourses = userCourses.map(userCourse => {
            const modifiedUserCourse = { ...userCourse.toJSON() };

            if (modifiedUserCourse.Course?.course_photo) {
                modifiedUserCourse.Course.course_photo = app_url() + modifiedUserCourse.Course.course_photo;
            } else {
                modifiedUserCourse.Course.course_photo = null;
            }
            if (modifiedUserCourse.Course?.course_curriculum_file) {
                modifiedUserCourse.Course.course_curriculum_file = app_url() + modifiedUserCourse.Course.course_curriculum_file;
            } else {
                modifiedUserCourse.Course.course_curriculum_file = null;
            }

            return modifiedUserCourse;
        });

        return modifiedUserCourses;
    } catch (error) {
        throw new Error(`Error retrieving courses for user ${id_user}: ${error.message}`);
    }
}


async function getCourseUsers(id_course) {
    try {
        const courseUsers = await models.UserCourse.findAll({
            where: { id_course: id_course },
        });
        return courseUsers;
    } catch (error) {
        throw new Error(`Error retrieving users for course ${id_course}: ${error.message}`);
    }
}

async function getCompletedCourses(id_user) {
    try {
        const userCourse = await models.UserCourse.findAll({
            where: { 
                id_user: id_user,
                progress_percent: 100
            }
        });
        const id_course = userCourse.map(us => us.id_course);
        const courses = await models.Course.findAll({
            where: { id_course: id_course },
            include: [
                {
                    model: models.Module,
                    include: [{ model: models.Submodule }]
                },
                { model: models.CourseObjective },
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
        throw new Error(`Error al recuperar los cursos completados: ${error.message}`);
    }
}


async function getRecentlyPurchasedCourses(id_user) {
    try {
        const userCourse = await models.UserCourse.findAll({
            where: {
                id_user: id_user,
                registration_date: {
                    [Op.gte]: Sequelize.literal("NOW() - INTERVAL '14 DAY'")
                }
            }
        });

        const id_course = userCourse.map(us => us.id_course);
        const courses = await models.Course.findAll({
            where: { id_course: id_course },
            include: [
                {
                    model: models.Module,
                    include: [{ model: models.Submodule }]
                },
                { model: models.CourseObjective },
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
        throw new Error(`Error al recuperar los cursos comprados recientemente: ${error.message}`);
    }
}


module.exports = {
    createUserCourse,
    getUserCourse,
    getAllUserCourses,
    updateUserCourse,
    deleteUserCourse,
    updateUserCourseScore,
    updateUserCourseCertificate,
    getUserCourseScore,
    getUserCourseCertificate,
    getUserCourses,
    getCourseUsers,
    getCompletedCourses,
    getRecentlyPurchasedCourses
};
