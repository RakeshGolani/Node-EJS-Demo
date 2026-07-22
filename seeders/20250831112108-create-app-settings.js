'use strict';

const { AppSetting } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const app_settings = [
            { app_name: 'maintenance_mode', setting: '0', compulsory: 'no' },
            { app_name: 'android_customer', setting: '1.0.0', compulsory: 'no' },
            { app_name: 'ios_customer', setting: '1.0.0', compulsory: 'no' },
        ];

        // if (!Array.isArray(app_settings) || app_settings.length === 0) {
        //     return;
        // }

        for (const appSetting of app_settings) {
            const existing = await AppSetting.findOne({
                where: { app_name: appSetting.app_name }
            });

            if (!existing) {
                await queryInterface.bulkInsert('app_settings', [{
                    id: require('crypto').randomUUID(),
                    app_name: appSetting.app_name,
                    setting: appSetting.setting,
                    compulsory: appSetting.compulsory,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }], {});
                console.log(`App setting Inserted: ${appSetting.app_name}`);
            } else {
                console.log(`App setting already exists: ${appSetting.app_name}`);
            }
        }
    },

    async down(queryInterface, Sequelize) {
        const appNames = [
            'maintenance_mode',
            'android_customer',
            'ios_customer',
        ];
        await queryInterface.bulkDelete('app_settings', {
            app_name: appNames
        }, {});
    }
};
