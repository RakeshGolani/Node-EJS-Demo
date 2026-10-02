const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");
const flash = require("connect-flash");
const session = require("express-session");
//const SequelizeStore = require("connect-session-sequelize")(session.Store);
const passport = require("passport");
//const responseFormatter = require("../middleware/responseFormatter");
//const sequelize = require("./db");
const db = require("../models"); // Load models
const expressLayouts = require("express-ejs-layouts");
const i18n = require("i18n");
const cookieParser = require("cookie-parser")
const theme = require("./theme");
//const { logReqRes } = require('../middleware/logRequest');

require("dotenv").config();
require("./passport")(passport);

const configureApp = (app) => {
    // Rate limiting middleware
    // const limiter = rateLimit({
    //     windowMs: 15 * 60 * 1000, // 15 minutes
    //     max: 1000, // limit each IP to 1000 requests per windowMs
    //     message: 'Too many requests from this IP, please try again later.'
    // });
    // app.use(limiter);

    // Express core middlewares
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(require('../utils/apiResponse/response'));
    //app.use(logReqRes());
    //app.use(responseFormatter);
    app.use(expressLayouts);

    // Static files
    app.use("/admin", express.static(path.join(__dirname, "../public"))); //admin
    app.use("/admin/storage", express.static(path.join(__dirname, "../storage"))); // global
    app.use("/config", express.static(path.join(__dirname, "../config"))); // global

    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "../views"));
    app.set("layout", "admin/layouts/master");
    app.set("layout extractScripts", true);
    app.set("layout extractStyles", true);

    // Flash messages
    app.use(flash());

    // Session configuration (must be before passport.session())
    // const sessionStore = new SequelizeStore({
    //     db: sequelize,
    //     tableName: 'Sessions', // Name of the table to store session data
    //     checkExpirationInterval: 15 * 60 * 1000, // 15 min
    //     expiration: 24 * 60 * 60 * 1000, // 24 hours
    // });

    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            store: db.sessionStore,
            resave: false,
            saveUninitialized: false,
            rolling: true, // <-- important, stops resetting expiry on each request
            cookie: { 
                httpOnly: true, 
                secure: false, // Set to true if using HTTPS in production
                maxAge: 24 * 60 * 60 * 1000 // Session valid for 24 hours
            },
        })
    );

    // Set admin data for use in views
    app.use((req, res, next) => {
        res.locals.admin = req.session.admin || null;
        next();
    });

    // Set current route for use in views
    app.use((req, res, next) => {
        res.locals.currentRoute = req.path;
        next();
    });

    //sessionStore.sync();

    // Passport authentication setup
    app.use(passport.initialize());
    app.use(passport.session());

    // Flash msg variables to views
    // app.use((req, res, next) => {
    //     res.locals.success_msg = req.flash('success_msg');
    //     res.locals.error_msg = req.flash('error_msg');
    //     next();
    // });

    //Notiflix message
    app.use((req, res, next) => {
        res.locals.success = req.flash("success_msg");
        res.locals.failure = req.flash("error_msg");
        res.locals.failure = req.flash("failure");
        const types = ["success", "failure", "error", "info", "warning"];
        res.locals.flashMessages = {};

        types.forEach((type) => {
        const message = req.flash(type);
            if (message.length) {
                res.locals.flashMessages[type] = message[0];
            }
        });

        next();
    });

    app.use(cookieParser()); // for parsing cookies

    i18n.configure({
        locales: ["en", "ar"],             // Supported languages
        directory: path.join(__dirname, "locales"),  // Where translation files are stored
        defaultLocale: "en",               // Fallback language
        queryParameter: 'lang',            // Allows ?lang=en in URLs
        autoReload: process.env.APP_ENV !== 'production', // Reload locale files if changed (dev only)
        syncFiles: process.env.APP_ENV !== 'production',  // Create missing locale files (dev only)
        cookie: 'lang',                    // Optional: store language in a cookie
    });

    // Initialize i18n middleware
    app.use(i18n.init);

    // Set locale for views
    app.use((req, res, next) => {
        res.locals.local = req.getLocale();
        res.locals.appName = res.__(process.env.APP_NAME || 'The Russian Tour');
        res.locals.theme = theme;
        next();
    });
};

module.exports = configureApp;
