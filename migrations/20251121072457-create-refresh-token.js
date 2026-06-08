'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('refresh_tokens', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			access_token: {
				type: Sequelize.TEXT,
				allowNull: true
			},
			refresh_token: {
				type: Sequelize.TEXT,
				allowNull: true
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			deletedAt:{
				type: Sequelize.DATE,
				allowNull:true
			}
		}, {
			indexes: [
				{
					fields: ['user_id']
				}
			]
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('refresh_tokens');
	}
};