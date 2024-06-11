'use strict';

module.exports = (sequelize, DataTypes) => {
  const SubmoduleAnswer = sequelize.define('SubmoduleAnswer', {
    id_answer: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    answers_content: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    answers_validity: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    id_question: {
      type: DataTypes.INTEGER,
      references: {
        model: 'submodule_question_table',
        key: 'id_question',
      },
      allowNull: false,
    },
  }, {
    tableName: 'submodule_answer_table',
    timestamps: false,
  });

  SubmoduleAnswer.associate = function(db) {
    SubmoduleAnswer.belongsTo(db.SubmoduleQuestion, {foreignKey: 'id_question'});
  };

  return SubmoduleAnswer;
};