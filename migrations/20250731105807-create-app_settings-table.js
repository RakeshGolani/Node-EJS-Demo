'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('app_settings', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        app_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        setting: {
            type: Sequelize.STRING,
            allowNull: false
        },
        compulsory: {
            type: Sequelize.ENUM('no', 'yes'),
            defaultValue: 'no',
            //comment: '0 = Not Compulsory, 1 = Compulsory',
            allowNull: false
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
        await queryInterface.dropTable('app_settings');
    }
};
