'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable('jobs', {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                allowNull: false
            },
            queue: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'default'
            },
            payload: {
                type: Sequelize.JSON,
                allowNull: false
            },
            attempts: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            reserved_at: {
                type: Sequelize.DATE,
                allowNull: true
            },
            available_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW')
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW')
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW')
            }
        });
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.dropTable('jobs');
    }
};