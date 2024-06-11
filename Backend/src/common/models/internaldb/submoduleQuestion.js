'use strict';

module.exports = (sequelize, DataTypes) => {
  const SubmoduleQuestion = sequelize.define('SubmoduleQuestion', {
    id_question: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    question_content: {
      type: DataTypes.STRING(250),
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
    question_description: {
      type: DataTypes.STRING(500),
    }
  }, {
    tableName: 'submodule_question_table',
    timestamps: false,
  });

  SubmoduleQuestion.associate = function(db) {
    SubmoduleQuestion.belongsTo(db.Submodule, {foreignKey: 'id_submodule'});
    SubmoduleQuestion.hasMany(db.SubmoduleAnswer, {foreignKey: 'id_question'});
  };

  return SubmoduleQuestion;
};