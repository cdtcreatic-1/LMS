'use strict';

module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define('Skill', {
    id_skill: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    skill_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  }, {
    tableName: 'course_skills_table',
    timestamps: false,
  });

  Skill.associate = function(db) {
    Skill.belongsToMany(db.Course, {
      through: db.CourseSkill,
      foreignKey: 'id_skill',
      otherKey: 'id_course'
    });
  };
  
  return Skill;
};