require('dotenv').config();
const express = require('express');
const db = require('./models');
const configureApp = require('./config/appConfig');

//const cors = require('cors');

// Import Routes
//const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/adminRoutes');
const apiRoutes = require('./routes/apiRoutes');
const webRoutes = require('./routes/webRoutes');

const path = require('path');

const app = express();

// Apply express configuration
configureApp(app);

app.use(express.json());

// Routes management
//app.use('/api/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api/auth', apiRoutes);
app.use('/api/customer', apiRoutes);
app.use('/', webRoutes);

app.use((req, res) => {
    res.status(404).render('404', {
        layout: false,
    });
});

app.locals.moment = require("moment-timezone", {
	timezone: process.env.APP_TIMEZONE,
});

// Sync DB and start server
db.sequelize.sync().then(() => {
    console.log("Database connected");
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.APP_URL}`);
        //console.log(`Server running on port http://localhost:${process.env.PORT}`);
    });
}).catch((err) => console.error("Database error", err));
