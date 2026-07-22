require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_NAME || '',
        host: process.env.DB_HOST || '127.0.0.1',
        dialect: process.env.DB_DIALECT || 'postgres',
        logging: false
    },
    test: {
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_NAME_TEST || 'database_test',
        host: process.env.DB_HOST || '127.0.0.1',
        dialect: process.env.DB_DIALECT || 'postgres'
    },
    production: {
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_NAME_PROD || 'database_production',
        host: process.env.DB_HOST || '127.0.0.1',
        dialect: process.env.DB_DIALECT || 'postgres'
    }
};
 