'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    user_phone: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    user_email: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },
    id_user_gender: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'user_gender',
        key: 'id_user_gender',
      },
    },
    user_username: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },
    user_password: {
      type: DataTypes.STRING(180),
      allowNull: false,
    },
    user_profile_photo: {
      type: DataTypes.STRING(250),
    },
    user_cover_photo: {
      type: DataTypes.STRING(250),
    },
    id_type_document: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'type_document_table',
        key: 'id_type_document',
      },
    },
    number_document: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },
    postal_code: {
      type: DataTypes.INTEGER,
    },
    id_state: {
      type: DataTypes.SMALLINT,
      references: {
        model: 'states_table',
        key: 'id_state',
      },
    },
    users_created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('NOW()')
    },
    users_updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    id_role: {
      type: DataTypes.SMALLINT,
      references: {
        model: 'roles_table',
        key: 'id_role',
      },
      defaultValue: 1,
    },
    user_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    register_from_google: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    learning_style: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'users_table',
    timestamps: false,
  });

  User.associate = function (db) {
    User.belongsTo(db.Roles, { foreignKey: 'id_role' });
    User.belongsTo(db.TypeDocument, { foreignKey: 'id_type_document' });
    User.belongsTo(db.States, { foreignKey: 'id_state' });
    User.belongsTo(db.UserGender, { foreignKey: 'id_user_gender' });
    User.hasOne(db.user_information, {
      foreignKey: 'id_user',
      as: 'user_information'
    });
    User.hasOne(db.UserCreation, {
      foreignKey: 'id_user_created_by',
      as: 'user_created_by',
    });
    User.hasOne(db.LoginAttempts, {
      foreignKey: 'id_user',
      as: 'loginAttempts'
    });
    User.hasOne(db.NewsEvent, {
      foreignKey: 'id_user',
      as: 'NewsEvent'
    });
    User.hasMany(db.UserCourse, {
      foreignKey: 'id_user'
    });
  };

  User.findAndCountAllPaginated = async function (page = 1) {
    const limit = 20; // Número máximo de usuarios por consulta
    const offset = (page - 1) * limit;

    const { count, rows } = await this.findAndCountAll({
      limit: limit,
      offset: offset,
      // Puedes agregar otras opciones como ordenamiento, etc.
    });

    return {
      totalPages: Math.ceil(count / limit),
      totalItems: count,
      currentPage: page,
      users: rows,
    };
  };


  return User;
};