'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserSkillPreference = sequelize.define('UserSkillPreference', {
    id_preferences: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users_table',
        key: 'id_user',
      },
    },
    id_skill: {
      type: DataTypes.INTEGER,
      references: {
        model: 'course_skills_table',
        key: 'id_skill',
      },
    },
  }, {
    tableName: 'user_skill_preferences',
    timestamps: false,
  });

  UserSkillPreference.associate = function(db) {
    UserSkillPreference.belongsTo(db.User, { foreignKey: 'id_user' });
    UserSkillPreference.belongsTo(db.CourseSkill, { foreignKey: 'id_skill' });
  };

  return UserSkillPreference;
};
