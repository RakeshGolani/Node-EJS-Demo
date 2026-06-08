const fs = require("fs");
const path = require("path");
require('dotenv').config();

function logResponse(req, res, response, statusCode) {
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
	const logDir = path.join(__dirname, "../storage", "logs");
	if (!fs.existsSync(logDir)) {
		fs.mkdirSync(logDir, { recursive: true, mode: 0o777 });
	}
	const prefix = req.user ? `User_${req.user.id}` : 'Common';
	const prefixDir = path.join(logDir, prefix);
	if (!fs.existsSync(prefixDir)) {
		fs.mkdirSync(prefixDir, { recursive: true, mode: 0o777 });
	}
	const fileName = `${parts.year}_${parts.month}_${parts.day}_${parts.hour}.log`;
	const filePath = path.join(prefixDir, fileName);
	const currentDateTime = `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
	const responseBody = JSON.stringify(response);
	const body = req.body && Object.keys(req.body).length > 0 ? `Body => ${JSON.stringify(req.body)}\n` : '';
	const logEntry = `\n${currentDateTime} | ${req.ip} => ${req.method} ${req.originalUrl}\nHeaders => ${JSON.stringify(req.headers)}\n${body}Response => Status: ${statusCode} | ${responseBody}\n`;
	fs.appendFile(filePath, logEntry, (err) => {
		if (err) console.error("Error writing response log:", err);
	});
}

module.exports = (req, res, next) => {
	res.success = (message, data = null, code = 200, extra = {}) => {
		message = req.__(message);
		const response = {
			status: true,
			message,
		};
		if (data !== null) response.data = data;
		if (extra && typeof extra === 'object' && Object.keys(extra).length > 0) {
			if (response?.data) {
				Object.assign(response.data, extra);
			}
		}
		res.status(code).json(response);
		res.on('finish', () => {
			logResponse(req, res, response, code);
		});
		return res;
	};

	res.error = (message, errors = null, code = 500) => {
		message = req.__ (message);
		const response = {
			status: false,
			message,
		};
		if (errors) response.errors = errors;
		res.status(code).json(response);
		res.on('finish', () => {
			logResponse(req, res, response, code);
		});
		return res;
	};

	next();
};
