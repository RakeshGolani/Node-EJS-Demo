const applyDateFormatting = require('../utils/datetimeFormatter');

module.exports = (sequelize, DataTypes) => {
    const Otp = sequelize.define('Otp', {
        phone: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('customer'),
            allowNull: false,
            defaultValue: 'customer'
        },
        otp: {
            type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4(6),
            allowNull: false
        },
        otp_type: {
            type: DataTypes.ENUM('mobile', 'email'),
            allowNull: false,
            defaultValue: 'mobile'
        },
        otp_code_expiry: {
            type: DataTypes.DATE,
            allowNull: false
        },
        is_verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        verified_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
    }, {
        tableName: 'otps',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['phone', 'otp_type'],
            },
        ]
    });

    applyDateFormatting(Otp); // Apply date formatting to the model
    return Otp;
};