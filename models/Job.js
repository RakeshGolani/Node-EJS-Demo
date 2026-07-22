module.exports = (sequelize, DataTypes) => {
    const Job = sequelize.define('Job', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        queue: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'default'
        },
        payload: {
            type: DataTypes.JSON,
            allowNull: false
        },
        attempts: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        reserved_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        available_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.fn('NOW')
        },
    }, {
        tableName: 'jobs',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                fields: ['queue', 'available_at']
            }
        ]
    });

    return Job;
}