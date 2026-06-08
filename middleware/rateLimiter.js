const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');

// Log blocked request
const logRateLimit = (req, type, message) => {
    const logDir = path.join(__dirname, '../storage/logs');
	const logPath = path.join(logDir, 'rate-limit.log');
    // Ensure directory exists
	if (!fs.existsSync(logDir)) {
		fs.mkdirSync(logDir, { recursive: true }); // Create nested folders
	}
	const logLine = `[${new Date().toISOString()}] ${type.toUpperCase()} BLOCKED: IP=${req.ip}, URL=${req.originalUrl}, UA="${req.get('User-Agent')}", MESSAGE="${message}"\n`;
	// Ensure file exists
	if (!fs.existsSync(logPath)) {
		fs.writeFileSync(logPath, '');
	}
    
	fs.appendFile(logPath, logLine, err => {
		if (err) console.error('Rate limit log error:', err);
	});
};

const createRateLimiter = ({
	max,
	windowMinutes,
	messageKey,
	messageArgs = [],
	responseType = 'api'
}) => rateLimit({
	windowMs: windowMinutes * 60 * 1000,
	max,
	standardHeaders: true,
	legacyHeaders: false,
	handler: (req, res) => {
		const translatedMessage = req.__(messageKey, ...messageArgs);
		logRateLimit(req, responseType, translatedMessage);

		switch (responseType) {
			case 'login':
				req.flash('error_msg', translatedMessage);
				return res.redirect('/admin/login');
			case 'html':
				req.flash('error_msg', translatedMessage);
				return res.redirect(req.get('Referer') || '/');
			default: // 'api'
				return res.status(429).json({ status:false, message: translatedMessage });
		}
	}
});

module.exports = {
	loginRateLimiter: createRateLimiter({
		max: 5,
		windowMinutes: 5,
		messageKey: 'You have been rate limited. Please try again after 5 minutes.',
		responseType: 'login'
	}),

	apiRateLimiter: createRateLimiter({
		max: 3,
		windowMinutes: 5,
		messageKey: 'You have been rate limited. Please try again after 5 minutes.',
		responseType: 'api'
	}),

	htmlFormRateLimiter: createRateLimiter({
		max: 3,
		windowMinutes: 5,
		messageKey: 'You have been rate limited. Please try again after 5 minutes.',
		responseType: 'html'
	})
};
