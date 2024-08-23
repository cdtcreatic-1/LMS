module.exports = (sequelize, DataTypes) => {
    const UserCreation = sequelize.define('UserCreation', {
        id_user_creation: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users_table',
                key: 'id_user',
            },
        },
        id_user_created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users_table',
                key: 'id_user',
            },
        },
    }, {
        tableName: 'user_creation',
        timestamps: false,
    });

    UserCreation.associate = function(db) {
        db.UserCreation.belongsTo(db.User, {
            foreignKey: 'id_user',
            as: 'user',
        });
        db.UserCreation.belongsTo(db.User, {
            foreignKey: 'id_user_created_by',
            as: 'user_created_by',
        });
    }
    return UserCreation;
}