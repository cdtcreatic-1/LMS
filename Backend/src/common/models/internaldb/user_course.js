'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserCourse = sequelize.define('UserCourse', {
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users_table',
        key: 'id_user',
      },
      primaryKey: true,
    },
    id_course: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'course_table',
        key: 'id_course',
      },
      primaryKey: true,
    },
    registration_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('NOW()'),
    },
    learner_opinion_about_course: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    progress_percent: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: true,
    },  
  },
    {
      tableName: 'users_courses_table',
      timestamps: false,
    });

  UserCourse.associate = function (db) {
    db.UserCourse.belongsTo(db.User, {
      foreignKey: 'id_user',
    });
    UserCourse.belongsTo(db.Course, {
      foreignKey: 'id_course',
    });
  };

  return UserCourse;
};
