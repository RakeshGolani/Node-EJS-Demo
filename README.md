## Setup & Run Instructions

1. Install project dependencies:

    npm install

2. Setup environment
   cp .env.example .env

3. Create database

    npx sequelize-cli db:create

4. Run database migrations:

    npx sequelize-cli db:migrate

5. Seed the database:

    npx sequelize-cli db:seed:all

6. Start the project:

    npm run dev

## Admin Panel Login Details

Email: admin.user@yopmail.com
Password: 12345678
