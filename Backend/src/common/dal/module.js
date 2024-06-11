const models = require('cccommon/models/internaldb');

async function createModule(moduleData) {
    try {
        const newModule = models.Module.build(moduleData);
        const savedModule = await newModule.save();
        return savedModule;
    } catch (error) {
        throw new Error(`Error creating module: ${error.message}`);
    }
};

async function getModuleById(id_module) {
    try {
        const module = await models.Module.findOne({
            where: {
                id_module: id_module
            },
        });

        return module;

    } catch (error) {
        throw new Error(`Error getting module by id: ${error.message}`);
    }
};

async function getModuleByTitle(module_title) {
    try {
        const module = await models.Module.findOne({
            where: {
                module_title: module_title
            },
        });

        return module;

    } catch (error) {
        throw new Error(`Error getting module by title: ${error.message}`);
    }
};

async function updateModule(id_module, moduleData) {
    try {
        const module = await models.Module.findByPk(id_module);
        if (!module) {
            throw new Error('Module not found');
        }
        await module.update(moduleData);
        return module.toJSON();
    } catch (error) {
        throw new Error(`Error updating module: ${error.message}`);
    }
};

async function deleteModule(id_module) {
    const transaction = await models.sequelize.transaction();
    try {
        const module = await models.Module.findByPk(id_module, { transaction });
        if (!module) {
            await transaction.rollback();
            throw new Error('Module not found');
        }

        const submodules = await models.Submodule.findAll({
            where: { id_module: id_module },
            transaction
        });

        for (const submodule of submodules) {
            const evaluations = await models.SubmoduleEvaluation.findAll({
                where: { id_submodule: submodule.id },
                transaction
            });

            for (const evaluation of evaluations) {
                const questions = await models.SubmoduleQuestion.findAll({
                    where: { id_evaluation: evaluation.id },
                    transaction
                });

                for (const question of questions) {
                    await models.SubmoduleAnswer.destroy({
                        where: { id_question: question.id },
                        transaction
                    });
                    await question.destroy({ transaction });
                }
                await evaluation.destroy({ transaction });
            }
            await submodule.destroy({ transaction });
        }
        await module.destroy({ transaction });

        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        throw new Error(`Error deleting module with dependencies: ${error.message}`);
    }
};

async function getModulesByIdCourse(id_course) {

    try {
        const modules = await models.Module.findAll({
            where: {
                id_course: id_course
            },
        });

        return modules;

    } catch (error) {
        throw new Error(`Error getting modules by id_course: ${error.message}`);
    }
}

async function getModulesByIdCourseWithSubmodules(id_course){
    try {
        const modules = await models.Module.findAll({
            where: {
                id_course: id_course
            }, include: [
                {
                    model: models.Submodule                   
                }
            ]
        });

        return modules;

    } catch (error) {
        throw new Error(`Error getting modules by id_course: ${error.message}`);
    }
}

module.exports = {
    createModule,
    getModuleById,
    getModuleByTitle,
    updateModule,
    deleteModule,
    getModulesByIdCourse,
    getModulesByIdCourseWithSubmodules
};
