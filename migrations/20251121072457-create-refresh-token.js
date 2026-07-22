'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('refresh_tokens', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
			},
			user_id: {
				type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
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