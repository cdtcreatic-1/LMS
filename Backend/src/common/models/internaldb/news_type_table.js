'use strict';

module.exports = (sequelize, DataTypes) => {
  const NewsType = sequelize.define('NewsType', {
    id_news_type: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    news_type_ocurrence: {
      type: DataTypes.STRING(50),
      allowNull: false,
    }
  }, {
    tableName: 'news_type_table',
    timestamps: false,
  });

  return NewsType;
};
