'use strict';

module.exports = (sequelize, DataTypes) => {
  const CourseSkill = sequelize.define('CourseSkill', {
    id_skill: {
      type: DataTypes.INTEGER,
      references: {
        model: 'course_skills_table',
        key: 'id_skill',
      },
      primaryKey: true,
      autoIncrement: true,
    },
    id_course: {
      type: DataTypes.INTEGER,
      references: {
        model: 'course_table',
        key: 'id_course',
      },
    },
    skill_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  }, {
    tableName: 'course_skills_table',
    timestamps: false,
  });

  CourseSkill.associate = function(db) {
    CourseSkill.belongsTo(db.Course, { foreignKey: 'id_course' });
  };

  return CourseSkill;
};