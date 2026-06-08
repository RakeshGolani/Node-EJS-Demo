require('dotenv').config();
const crypto = require('crypto');

const timezoneNow = () => {
	const timezone = process.env.TIMEZONE || 'Asia/Riyadh';
	const localTime = new Date().toLocaleString("en-US", { timeZone: timezone });
	const timezoneDateTime = new Date(localTime);
	return timezoneDateTime;
};

function getEncryptedAmount(amount) {
	const password = process.env.WALLET_PWD;
	const key = crypto.createHash('sha256').update(password).digest().slice(0, 32);
	const iv = Buffer.alloc(16, 0); // 16 null bytes

	const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
	const encrypted = Buffer.concat([
		cipher.update(amount.toString(), 'utf8'),
		cipher.final()
	]);

	return encrypted.toString('base64'); // same as PHP base64_encode
}

function getDecryptedAmount(encryptedAmount) {
	const password = process.env.WALLET_PWD;
	const key = crypto.createHash('sha256').update(password).digest().slice(0, 32);
	const iv = Buffer.alloc(16, 0);

	const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
	const decrypted = Buffer.concat([
		decipher.update(Buffer.from(encryptedAmount, 'base64')),
		decipher.final()
	]);

	return decrypted.toString('utf8');
}

function getNumberFormat(amount) {
	const formatter = new Intl.NumberFormat("en-IN", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
	return formatter.format(Number(amount) || 0)
}

module.exports = { timezoneNow, getEncryptedAmount, getDecryptedAmount, getNumberFormat };