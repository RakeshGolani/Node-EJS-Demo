'use strict';

const { Cms } = require('../models');

const cmsArray = [
    { name: 'About Us', name_ar: 'من نحن', slug: 'user-about-us', content: 'Content', content_ar: 'محتوى' },
    { name: 'Terms & Conditions', name_ar: 'شروط الخدمة', slug: 'user-terms-conditions', content: 'Content', content_ar: 'محتوى' },
    { name: 'Privacy Policy', name_ar: 'سياسة الخصوصية', slug: 'user-privacy-policy', content: 'Content', content_ar: 'محتوى' },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        for (const cms of cmsArray) {
            const exists = await Cms.findOne({ where: { name: cms.name } });

            if (!exists) {
                await Cms.create({
                    name: cms.name,
                    name_ar: cms.name_ar,
                    slug: cms.slug,
                    content: cms.content,
                    content_ar: cms.content_ar,
                    panel: 'user'
                });
                console.log(`Cms Inserted: ${cms.name}`);
            } else {
                console.log(`Cms already exists: ${cms.name}`);
            }
        }
    },

    async down (queryInterface, Sequelize) {
        const names = permissions.map(p => p.name);
        await queryInterface.bulkDelete('cms', { name: names }, {});
    }
};
