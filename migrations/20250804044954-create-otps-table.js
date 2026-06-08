'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable('otps', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            phone: {
                type: Sequelize.STRING(15),
                allowNull: false
            },
            type: {
                type: Sequelize.ENUM('customer'),
                allowNull: false,
                defaultValue: 'customer'
            },
            otp: {
                type: Sequelize.INTEGER(6),
                allowNull: false
            },
            otp_type: {
                type: Sequelize.ENUM('mobile', 'email'),
                allowNull: false,
                defaultValue: 'mobile'
            },
            otp_code_expiry: {
                type: Sequelize.DATE,
                allowNull: false
            },
            is_verified: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            verified_at: {
                type: Sequelize.DATE,
                allowNull: true
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        });

        await queryInterface.addConstraint('otps', {
            fields: ['phone', 'otp_type'],
            type: 'unique',
            name: 'unique_otp_per_phone_and_type'
        });
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.dropTable('otps');
    }
};
