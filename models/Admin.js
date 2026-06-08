const applyDateFormatting = require('../utils/datetimeFormatter');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define('Admin', {
        parent_id: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        email_verified_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        profile_image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            allowNull: false,
            defaultValue: 'active'
        },
        email_verification_token: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        pending_email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        resetToken: { 
            type: DataTypes.TEXT,
            allowNull: true
        },
        resetTokenExpiry: { 
            type: DataTypes.DATE,
            allowNull: true
        },
        profileUrl: {
			type: DataTypes.VIRTUAL,
			get() {
				const baseUrl = process.env.APP_URL || 'http://127.0.0.1:3000';
				let profileUrl;
				if (this.profile_image) {
					profileUrl = `${baseUrl}/${this.profile_image.replace(/^\/?/, '')}`;
				} else {
					profileUrl = `${baseUrl}/admin/assets/img/avatars/default.png`;
				}
				return profileUrl;
			}
		},
    }, {
        paranoid: true,
        timestamps: true,
        deletedAt: 'deletedAt',
        tableName: 'admins'
    });

    Admin.prototype.validatePassword = async function (inputPassword) {
        return await bcrypt.compare(inputPassword, this.password);
    };

    // Team add assign role relationship
    Admin.associate = function (models) {
        // No associations
    };


    applyDateFormatting(Admin);
    
    return Admin;
}