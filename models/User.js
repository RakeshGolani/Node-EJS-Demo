'use strict';
const applyDateFormatting = require('../utils/datetimeFormatter');
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.RefreshToken, { foreignKey: 'user_id', as: 'refreshToken' });
        }
    }
    User.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
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
        phone: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        latitude: {
            type: DataTypes.STRING,
            allowNull: true
        },
        longitude: {
            type: DataTypes.STRING,
            allowNull: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: { 
            type: DataTypes.STRING, 
            defaultValue: 'user' 
        },
        status: { 
            type: DataTypes.STRING,
            defaultValue: 'active'
        },
        profile_image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        resetToken: { 
            type: DataTypes.TEXT 
        },
        resetTokenExpiry: { 
            type: DataTypes.DATE 
        },
        last_login_at: { 
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        paranoid: true,
        timestamps: true,
        deletedAt: 'deletedAt',
        tableName: 'users'
    });

    User.prototype.validatePassword = async function (inputPassword) {
        return await bcrypt.compare(inputPassword, this.password);
    };

    applyDateFormatting(User);
    
    return User;
}