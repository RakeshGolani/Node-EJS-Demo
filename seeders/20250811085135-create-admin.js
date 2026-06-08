'use strict';

const { Admin } = require('../models');
const bcrypt = require('bcryptjs');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const existingAdmin = await Admin.findOne({ 
            where: { email: 'admin.user@yopmail.com' } 
        });

        if (existingAdmin) {
            console.log('Admin user already exists.');
            return;
        }

        const hashedPassword = await bcrypt.hash('12345678', 10);

        await Admin.create({
            name: 'Admin User',
            email: 'admin.user@yopmail.com',
            phone: 555555555,
            address: null,
            password: hashedPassword,
            profile_image: null,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        });

        console.log('Admin user created successfully.');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('admins', { 
            email: 'admin.user@yopmail.com' 
        }, {});
    }
};
