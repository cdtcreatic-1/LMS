'use strict';

module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id_course: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    course_title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    course_description: {
      type: DataTypes.STRING(500),
    },
    course_duration: {
      type: DataTypes.STRING(250),
    },
    course_instructor_name: {
      type: DataTypes.STRING(50),
    },
    course_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    course_curriculum_file: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    course_start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    course_photo: {
      type: DataTypes.STRING(250),
    },
    course_video: {
      type: DataTypes.STRING(250),
    },
    course_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    course_created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('NOW()')
    },
    course_updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'course_table',
    timestamps: false,
  });

  Course.associate = function(db) {
    Course.belongsToMany(db.Skill, {
      through: db.CourseSkill,
      foreignKey: 'id_course',
      otherKey: 'id_skill'
    });
    Course.hasMany(db.Module, {foreignKey: 'id_course'});
    Course.hasMany(db.CourseObjective, {foreignKey: 'id_course'});
    Course.hasMany(db.UserCourse, {foreignKey: 'id_course'});
  };

  return Course;
};