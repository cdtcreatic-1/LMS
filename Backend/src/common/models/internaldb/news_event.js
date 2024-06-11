'use strict';

module.exports = (sequelize, DataTypes) => {
  const NewsEvent = sequelize.define('NewsEvent', {
    id_news_event: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    news_title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    news_image_url: {
      type: DataTypes.STRING(500),
    },
    news_video_url: {
      type: DataTypes.STRING(500),
    },
    news_reference_link: {
      type: DataTypes.STRING(500),
    },
    news_content_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    news_event_duration: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    news_publication_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('NOW()')
    },
    news_is_highlighted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    id_news_type: {
      type: DataTypes.INTEGER,
      references: {
        model: 'news_type_table',
        key: 'id_news_type',
      },
    },
    id_user: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users_table',
        key: 'id_user',
      },
    }
  }, {
    tableName: 'news_events_table',
    timestamps: false,
  });

  NewsEvent.associate = function(db) {
    NewsEvent.belongsTo(db.NewsType, {foreignKey: 'id_news_type'});
    NewsEvent.belongsTo(db.User, {foreignKey: 'id_user'});
  };

  return NewsEvent;
};
