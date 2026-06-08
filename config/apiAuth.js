const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

exports.generateAccessToken = (user, req) => {
	return jwt.sign(
		{ id: user.id },
		ACCESS_SECRET, 
		{ expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRE) }
	);
}

exports.generateRefreshToken = (user) => {
	return jwt.sign(
		{ id: user.id },
		REFRESH_SECRET,
		{ expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRE) }
	);
}

exports.verifyAccessToken = (token) => {
	try {
		return jwt.verify(token, ACCESS_SECRET);
	} catch (err) {
		return null;
	}
}

exports.verifyRefreshToken = (token) => {
	try {
		return jwt.verify(token, REFRESH_SECRET);
	} catch (err) {
		return null;
	}
}
