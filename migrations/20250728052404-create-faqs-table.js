'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
        await queryInterface.createTable('faqs', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        role: {
            type: Sequelize.ENUM('admin', 'web'),
            defaultValue: 'web',
        },
        question: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        answer: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active',
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
    await queryInterface.dropTable('faqs');
  }
};
