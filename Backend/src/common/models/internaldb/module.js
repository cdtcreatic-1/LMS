'use strict';

module.exports = (sequelize, DataTypes) => {
  const Module = sequelize.define('Module', {
    id_module: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    module_title: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    module_description: {
      type: DataTypes.STRING(500),
    },
    module_created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('NOW()')
    },
    module_updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    module_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    id_course: {
      type: DataTypes.INTEGER,
      references: {
        model: 'course_table',
        key: 'id_course',
      },
    },
  }, {
    tableName: 'module_table',
    timestamps: false,
  });

  Module.associate = function(db) {
    Module.belongsTo(db.Course, {foreignKey: 'id_course'});
    Module.hasMany(db.Submodule, {foreignKey: 'id_module'});
  };
  

  return Module;
};