'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING,
                unique: true
            },
            phone: {
                type: Sequelize.STRING,
                unique: true
            },
            address: {
                type: Sequelize.STRING
            },
            latitude: {
                type: Sequelize.STRING,
                allowNull: true
            },
            longitude: {
                type: Sequelize.STRING,
                allowNull: true
            },
            password: {
                type: Sequelize.STRING
            },
            role: {
                type: Sequelize.STRING
            },
            status: {
                type: Sequelize.STRING
            },
            profile_image: {
                type: Sequelize.STRING,
                allowNull: true
            },
            resetToken: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            resetTokenExpiry: {
                type: Sequelize.DATE,
                allowNull: true
            },
            last_login_at: {
                type: Sequelize.DATE,
                allowNull: true
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            deletedAt: {
                type: Sequelize.DATE,
                allowNull: true
            }
        });
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
    }
};
