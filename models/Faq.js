const applyDateFormatting = require('../utils/datetimeFormatter');

module.exports = (sequelize, DataTypes) => {
  const Faq = sequelize.define('Faq', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('admin', 'web'),
            defaultValue: 'web',
        },
        question: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        answer: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active',
            allowNull: false
        },
    }, {
            paranoid: true,
            timestamps: true,
            deletedAt: 'deletedAt',
            tableName: 'faqs'
        });

    applyDateFormatting(Faq);
    return Faq;
}