'use strict';

module.exports = (sequelize, DataTypes) => {
  const CourseLearning = sequelize.define('CourseLearning', {
    id_learning: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    learning_text: {
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
    tableName: 'course_learnings_table',
    timestamps: false,
  });

  CourseLearning.associate = function(db) {
    CourseLearning.belongsTo(db.Course, {foreignKey: 'id_course'});
  };

  return CourseLearning;
};