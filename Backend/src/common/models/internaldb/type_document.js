'use strict'

module.exports = (sequelize, DataTypes) => {
	const TypeDocument = sequelize.define('TypeDocument', {
		id_type_document: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		type_document_name: {
			type: DataTypes.STRING(45),
			allowNull: false,
			unique: true,
		},
	}, {
		tableName: 'type_document_table',
		timestamps: false
	});

	return TypeDocument;
}