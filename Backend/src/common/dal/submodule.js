const models = require('cccommon/models/internaldb');
const { frontend_host, app_url } = require('cccommon/config');


async function createSubmodule(submoduleData) {
    try {
        const newSubmodule = models.Submodule.build(submoduleData);
        const savedSubmodule = await newSubmodule.save();
        return savedSubmodule;
    } catch (error) {
        throw new Error(`Error creating submodule: ${error.message}`);
    }
};

async function getSubmoduleById(id_submodule) {
    try {
        const submodule = await models.Submodule.findOne({
            where: {
                id_submodule: id_submodule
            },
        });

        return submodule;

    } catch (error) {
        throw new Error(`Error getting submodule by id: ${error.message}`);
    }
};

async function getSubmodulesByModule(id_module, includeResources = false) {
    try {
        const submodules = await models.Submodule.findAll({
            where: {
                id_module: id_module
            },
            include: [
                { model: models.UserSubmoduleProgress }
            ]
        });

        if (includeResources) {
            submodules.forEach(submodule => {
                if (submodule.submodule_resources) {
                    submodule.submodule_resources = app_url() + submodule.submodule_resources;
                } else {
                    submodule.submodule_resources = null;
                }

                if (submodule.subSubmodules) {
                    submodule.subSubmodules.forEach(subSubmodule => {
                        if (subSubmodule.submodule_resources) {
                            subSubmodule.submodule_resources = app_url() + subSubmodule.submodule_resources;
                        } else {
                            subSubmodule.submodule_resources = null;
                        }
                    });
                }
            });
        }

        return submodules;

    } catch (error) {
        throw new Error(`Error getting submodules: ${error.message}`);
    }
};

async function getSubmoduleInfoById(id_submodule) {
    try {
        const submoduleInfo = await models.Submodule.findByPk(id_submodule, {
            include: [{
                model: models.SubmoduleQuestion,
                include: [{
                    model: models.SubmoduleAnswer
                }]
            }]
        });

        if (!submoduleInfo) {
            return null;
        }
        return submoduleInfo;
    } catch (error) {
        console.error(`Error en getSubmoduleInfoById: ${error.message}`);
        throw error;
    }
};


async function getSubmoduleByTitle(submodule_title) {
    try {
        const submodule = await models.Submodule.findOne({
            where: {
                submodule_title: submodule_title
            },
        });

        return submodule;

    } catch (error) {
        throw new Error(`Error getting submodule by title: ${error.message}`);
    }
};

async function updateSubmodule(id_submodule, submoduleData) {
    try {
        const submodule = await models.Submodule.findByPk(id_submodule);
        if (!submodule) {
            throw new Error('Submodule not found');
        }
        await submodule.update(submoduleData);
        return submodule.toJSON();
    } catch (error) {
        throw new Error(`Error updating submodule: ${error.message}`);
    }
};

async function deleteSubmodule(id_submodule) {
    const transaction = await models.sequelize.transaction();
    try {
        const submodule = await models.Submodule.findByPk(id_submodule, { transaction });
        if (!submodule) {
            await transaction.rollback();
            throw new Error('Submodule not found');
        }

        const evaluations = await models.SubmoduleEvaluation.findAll({
            where: { id_submodule: id_submodule },
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

        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        throw new Error(`Error deleting submodule with dependencies: ${error.message}`);
    }
};

module.exports = {
    createSubmodule,
    getSubmoduleById,
    getSubmoduleByTitle,
    updateSubmodule,
    deleteSubmodule,
    getSubmodulesByModule,
    getSubmoduleInfoById
};
