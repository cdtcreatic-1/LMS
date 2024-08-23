'use strict';

module.exports = (sequelize, DataTypes) => {
  const SubmoduleEvaluation = sequelize.define('SubmoduleEvaluation', {
    id_evaluation: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    evaluation_title: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    evaluation_description: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    id_submodule: {
      type: DataTypes.INTEGER,
      references: {
        model: 'submodule_table',
        key: 'id_submodule',
      },
      allowNull: false,
    },
  }, {
    tableName: 'submodule_evaluation_table',
    timestamps: false,
  });

  SubmoduleEvaluation.associate = function(db) {
    SubmoduleEvaluation.belongsTo(db.Submodule, {foreignKey: 'id_submodule'});
  };

  return SubmoduleEvaluation;
};