'use strict';

module.exports = (sequelize, DataTypes) => {
  const CourseStatus = sequelize.define('CourseStatus', {
    id_status: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    course_status_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
  }, {
    tableName: 'course_status_table',
    timestamps: false,
  });

  return CourseStatus;
};
