const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { Admin } = require('../models'); // Sequelize model

module.exports = function(passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true // Important: allows req to be passed to the callback
    }, 
    async (req, email, password, done) => {
        try {
            const role = req.body.role;
            const admin = await Admin.findOne({ where: { email } });

            if (!admin) {
                return done(null, false, { message: 'Incorrect email or password.' });
            }

            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect email or password.' });
            }

            return done(null, admin);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((admin, done) => {
        done(null, admin.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const admin = await Admin.findByPk(id);
            done(null, admin);
        } catch (error) {
            done(error);
        }
    });
};
