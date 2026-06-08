const fs = require("fs");
const path = require("path");
require('dotenv').config();

function logReqRes() {
	return (req, res, next) => {
		const now = new Date();
		const formatter = new Intl.DateTimeFormat("en-GB", {
			timeZone: process.env.TIMEZONE || "Asia/Riyadh",
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
		});
		const parts = formatter.formatToParts(now).reduce((acc, part) => {
			if (part.type !== "literal") acc[part.type] = part.value;
			return acc;
		}, {});
		const logDir = path.join(__dirname, "../../storage", "logs");
		if (!fs.existsSync(logDir)) {
			fs.mkdirSync(logDir, { recursive: true, mode: 0o777 });
		}
		const prefix = req.user ? `User_${req.user.id}` : 'Common';
		const fileName = `${prefix}_${parts.year}_${parts.month}_${parts.day}_${parts.hour}.log`;
		const filePath = path.join(logDir, fileName);
		const currentDateTime = `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
		const body = req.body && Object.keys(req.body).length > 0 ? `Body => ${JSON.stringify(req.body)}\n` : '';
		const ip = req.headers["x-real-ip"] || req.ip;
		const logEntry = `\n${currentDateTime} | ${ip} => ${req.method} ${req.originalUrl}\nHeaders => ${JSON.stringify(req.headers)}\n${body}`;
		fs.appendFile(filePath, logEntry, (err) => {
			if (err) console.error("Error writing request log:", err);
		});
		const supportedLangs = ['en', 'ar'];
		let lang = (req.headers['accept-language'] || 'ar').toLowerCase();
		if (!supportedLangs.includes(lang)) {
			lang = 'ar';
		}
		req.language = lang;
		try {
			const translations = require(path.join(__dirname, '../locales', lang, 'translation.json'));
			req.t = (key) => {
				return translations[key] || key
					.replace(/_/g, ' ')
					.replace(/\b\w/g, c => c.toUpperCase());
			};
		} catch (err) {
			console.error(`Missing translation file for lang=${lang}`, err);
			req.t = (key) => key
				.replace(/_/g, ' ')
				.replace(/\b\w/g, c => c.toUpperCase());
		}
		next();
	};
}

module.exports = {
	logReqRes,
};
