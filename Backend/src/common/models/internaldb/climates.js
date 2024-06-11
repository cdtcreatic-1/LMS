module.exports = (sequelize, DataTypes) => {
    const Climates = sequelize.define('Climates', {
        id_climate: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        climate_name: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true,
        },
    }, {
        tableName: 'climates_table',
        timestamps: false,
    });

    return Climates;
}