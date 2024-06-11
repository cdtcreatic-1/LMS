'use strict';

module.exports = (sequelize, DataTypes) => {
  const CourseObjective = sequelize.define('CourseObjective', {
    id_objective: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    objective_text: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    id_course: {
      type: DataTypes.INTEGER,
      references: {
        model: 'course_table',
        key: 'id_course',
      },
    },
  }, {
    tableName: 'course_objectives_table',
    timestamps: false,
  });

  CourseObjective.associate = function(db) {
    CourseObjective.belongsTo(db.Course, {foreignKey: 'id_course'});
  };

  return CourseObjective;
};