const applyDateFormatting = require('../utils/datetimeFormatter');

module.exports = (sequelize, DataTypes) => {
  const ContactUs = sequelize.define('ContactUs', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    reply: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    is_replied: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    }, {
        paranoid: true,
        timestamps: true,
        deletedAt: 'deletedAt',
        tableName: 'contact_us',
    });

//   ContactUs.prototype.getFormattedCreatedAt = function() {
//     return applyDateFormatting(this.createdAt);
//   }
applyDateFormatting(ContactUs);

  return ContactUs;
}