'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class RefreshToken extends Model {
		static associate(models) {
			RefreshToken.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
		}
	}
	RefreshToken.init({
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		access_token: {
			type:DataTypes.TEXT('long'), 
		},
		refresh_token: {
			type: DataTypes.TEXT('long'),
			allowNull: true,
		},
	}, {
		sequelize,
		modelName: 'RefreshToken',
		tableName: 'refresh_tokens',
		timestamps: true,
		deletedAt: 'deletedAt'
	});
	return RefreshToken;
};