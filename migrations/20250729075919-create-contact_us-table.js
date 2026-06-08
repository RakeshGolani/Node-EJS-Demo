'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
async up (queryInterface, Sequelize) {
    await queryInterface.createTable('contact_us', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true
        },
        message: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        reply: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        is_replied: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        }
        });
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.dropTable('contact_us');
    }
};
