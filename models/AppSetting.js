const applyDateFormatting = require('../utils/datetimeFormatter');

module.exports = (sequelize, DataTypes) => {
    const appSetting = sequelize.define('AppSetting', {
        app_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        setting: {
            type: DataTypes.STRING,
            allowNull: false
        },
        compulsory: {
            type: DataTypes.ENUM('no', 'yes'),
            defaultValue: 'no',
            //comment: '0 = Not Compulsory, 1 = Compulsory',
            allowNull: false
        },

    }, {
        paranoid: true,
        timestamps: true,
        deletedAt: 'deletedAt',
        tableName: 'app_settings',
    });

    applyDateFormatting(appSetting);
        
    return appSetting;
}