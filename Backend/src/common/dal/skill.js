const models = require('cccommon/models/internaldb');

async function createSkill(skillData) {
    try {
        const newSkill = models.Skill.build(skillData);
        const savedSkill = await newSkill.save();
        return savedSkill;
    } catch (error) {
        throw new Error(`Error creating skill: ${error.message}`);
    }
};

async function getSkillById(id_skill) {
    try {
        const skill = await models.Skill.findByPk(id_skill);
        return skill;
    } catch (error) {
        throw new Error(`Error getting skill by id: ${error.message}`);
    }
};

async function getAllSkill() {
    try {
        const skill = await models.Skill.findAll();
        return skill;
    } catch (error) {
        throw new Error(`Error getting skill by id: ${error.message}`);
    }
};

async function updateSkill(id_skill, skillData) {
    try {
        const skill = await models.Skill.findByPk(id_skill);
        await skill.update(skillData);
        return skill.toJSON();
    } catch (error) {
        throw new Error(`Error updating skill: ${error.message}`);
    }
};

async function deleteSkill(id_skill) {
    try {
        const skill = await models.Skill.findByPk(id_skill);
        if (!skill) {
            return false;
        }
        await skill.destroy();
        return true;
    } catch (error) {
        throw new Error(`Error deleting skill: ${error.message}`);
    }
};

module.exports = {
    createSkill,
    getSkillById,
    updateSkill,
    deleteSkill,
    getAllSkill    
};