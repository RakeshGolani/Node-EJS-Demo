const applyDateFormatting = require('../utils/datetimeFormatter');

module.exports = (sequelize, DataTypes) => {
    const cms = sequelize.define('Cms', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name_ar: {
            type: DataTypes.STRING,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        content_ar: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        panel: {
            type: DataTypes.ENUM('admin', 'user', 'web'),
            defaultValue: 'user'
        },

    }, {
        paranoid: true,
        timestamps: true,
        deletedAt: 'deletedAt',
        tableName: 'cms',
    });

    applyDateFormatting(cms);
    
      return cms;
}