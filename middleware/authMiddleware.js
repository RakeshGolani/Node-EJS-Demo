const { User, RefreshToken } = require('../models');
const { verifyAccessToken } = require('../config/apiAuth');
module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.session && req.session.admin) {
		req.admin = req.session.admin;
		return next();
	}
        req.flash('failure', res.__('Session expired, please login again'));
        res.redirect('/admin/login');
    },

    redirectIfLoggedIn: (req, res, next) => {
        if (req.session && req.session.admin) {
            return res.redirect('/admin/dashboard');
        }
        return next();
    },

    verifyToken: async (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.error(req.__('Token not found'), null, 401);
        const decoded = verifyAccessToken(token);
        if (!decoded) {
            return res.error(req.__('Fail to verify token'), null, 403);
        } else {
            const tokenData = await RefreshToken.findOne({
                where: { access_token: token },
                include: [{
                    model: User, as: 'user'
                }],
            });
            if (!tokenData) {
                return res.error(req.__('You are unauthorized'), null, 401);
            } else {
                req.user = tokenData.user;
                req.token = token;
            }
            next();
        }
    }
};