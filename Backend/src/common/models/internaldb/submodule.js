'use strict';

module.exports = (sequelize, DataTypes) => {
  const Submodule = sequelize.define('Submodule', {
    id_submodule: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    submodule_title: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    submodule_summary: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    submodule_resources: {
      type: DataTypes.STRING(500),
    },
    submodule_class_video: {
      type: DataTypes.STRING(250),
    },
    submodule_created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('NOW()')
    },
    submodule_updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    submodule_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    id_module: {
      type: DataTypes.INTEGER,
      references: {
        model: 'module_table',
        key: 'id_module',
      },
      allowNull: false,
    },
  }, {
    tableName: 'submodule_table',
    timestamps: false,
  });

  Submodule.associate = function(db) {
    Submodule.belongsTo(db.Module, {foreignKey: 'id_module'});
    Submodule.hasMany(db.SubmoduleQuestion, {foreignKey: 'id_submodule'});
    Submodule.hasOne(db.UserSubmoduleProgress, {foreignKey: 'id_submodule'});
  };

  return Submodule;
};
