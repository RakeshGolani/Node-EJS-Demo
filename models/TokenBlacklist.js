module.exports = (sequelize, DataTypes) => {
    const TokenBlacklist = sequelize.define('TokenBlacklist', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        paranoid: false, // no soft delete needed unless you want it
        timestamps: true, // createdAt and updatedAt
        tableName: 'TokenBlacklists' // matches your migration table name
    });

    return TokenBlacklist;
}