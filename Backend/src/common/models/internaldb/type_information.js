'use strict'

module.exports = (sequelize, DataTypes) => {
	const TypeInformation = sequelize.define('TypeInformation', {
		id_type_of_information: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true

		},
		type_of_information_name: {
			type: DataTypes.STRING(90),
			allowNull: false,
			unique: true
		},
	}, {
		tableName: 'type_of_information_table',
		timestamps: false
	});
	return TypeInformation;
}