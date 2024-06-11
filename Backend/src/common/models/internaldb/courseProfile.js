'use strict';

module.exports = (sequelize, DataTypes) => {
  const CourseProfile = sequelize.define('CourseProfile', {
    id_course_profile: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    course_profile: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
  }, {
    tableName: 'course_profile_table',
    timestamps: false,
  });

  return CourseProfile;
};
