const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Otp, RefreshToken } = require("../../../models");
const { generateAccessToken, generateRefreshToken } = require('../../../config/apiAuth');
const { userRegisterValidatorFields } = require("../../../utils/apiValidator/validatorRequiredFields");
const common = require('../../../utils/common');
require("dotenv").config();

class AuthController {
    static async register(req, res) {
        try {
            const { name, email, phone, address, latitude, longitude, password } = req.body;

            const errors = await userRegisterValidatorFields (req.body, req, res);
            if (Object.keys(errors).length > 0) {
                res.status(400).json({ status: false, errors });
            }

            // const existing = await User.findOne({ where: { email } });
            // if (existing) {
            //     return res.status(400).json({ message: "User already exists" });
            // }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                name,
                email,
                phone,
                address,
                latitude,
                longitude,
                password: hashedPassword,
            });

            const newUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                latitude: user.latitude,
                longitude: user.longitude,
            }

            return res.success(req.__("User registered successfully"),newUser, 200);
        } catch (error) {
            console.error(error);
            return res.error(error.message, null, 500)
        }
    }

    // static async login(req, res) {
    //     try {
    //     const { email, password, token } = req.body || {};
    //     const user = await User.findOne({ where: { email } });
    //         if (!user)
    //             return res.status(400).json({ status: false, message: req.__("Invalid credentials") });

    //     const isMatch = await bcrypt.compare(password, user.password);
    //         if (!isMatch)
    //             return res.status(400).json({ status: false, message: req.__("Invalid credentials") });

    //     const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    //         expiresIn: "1y",
    //     });

    //     //     if(token && token !== 'undefined' && token !== 'null') {
    //     //     const push_title = 'Welcome Back!';
    //     //     const push_body = 'Thank you for logging in!';
    //     //     const data = { key1: 'value1', key2: 'value2' };
    //     //     sendPush(token, push_title, push_body, data);

    //     //     user.token = token;
    //     //     await user.save();
    //     //   }
    //     const baseUrl = `${req.protocol}://${req.get('host')}`;
    //     const profileImageUrl = user.profile_image ? `${baseUrl}${user.profile_image}` : null;
    //     res.json({
    //         status: true,
    //         message: req.__("Login successfully"),
    //         token: jwtToken,
    //         data: {
    //                 id: user.id,
    //                 name: user.name,
    //                 email: user.email,
    //                 phone: user.phone,
    //                 address: user.address,
    //                 status: user.status,
    //                 profile_image: profileImageUrl,
    //                 createdAt: user.createdAt,
    //             },
    //         });
    //     } catch (err) {
    //         return res.status(500).json({ status: false, message: err.message });
    //     }
    // }

    static async login(req, res) {
        try {
            const { phone, otp } = req.body || {};

            // Find matching OTP record (verified = false until checked)
            const otpRecord = await Otp.findOne({
                where: {
                    //phone,
                    otp_type: 'mobile',
                    otp,
                    is_verified: false
                }
            });

            if (!otpRecord) {
                return res.error(req.__("Invalid OTP"), 500);
            }

            // Check OTP expiration
            if (otpRecord.otp_code_expiry < new Date()) {
                return res.error(req.__("OTP expired"), 500);
            }

            // Find user
            const user = await User.findOne({ where: { phone } });

            if (!user) {
                return res.error(req.__("Invalid phone number"), 500);
            }

            // Mark OTP as verified
            otpRecord.is_verified = true;
            otpRecord.verified_at = new Date();
            await otpRecord.save(); // save instead of delete()
            // await Otp.destroy({ where: { id: otpRecord.id } }); // Optionally delete OTP record

            // Generate JWT token
            const accessToken = generateAccessToken(user, req);
		    const refreshToken = generateRefreshToken(user);
            
            const tokens = await RefreshToken.findAll({
				where: { user_id: user.id },
				order: [['updatedAt', 'ASC']],
			});
		   var timezoneDateTime = common.timezoneNow();
			if (tokens.length >= 5) {
				const oldestToken = tokens[0];
				oldestToken.access_token = accessToken;
				oldestToken.refresh_token = refreshToken;
				await oldestToken.save();
			} else {
				await RefreshToken.create({
					access_token: accessToken,
					refresh_token: refreshToken,
					user_id: user.id,
				});
			}

			await User.update(
				{ last_login_at: timezoneDateTime },
				{ where: { id: user.id } }
			);

            const userData = {
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                phone: user.phone,
                address: user.address,
                latitude: user.latitude,
                longitude: user.longitude,
                status: user.status,
                profile_image: user.profile_image
                    ? `${req.protocol}://${req.get('host')}${user.profile_image}`
                    : null
            }
            const extraData = {
                access_token: accessToken,
                refresh_token: refreshToken
            };

            // Return response
            return res.success( req.__("Login successfully"), userData, 200, extraData );
        } catch (error) {
            console.error(error);
            return res.error(error.message, null, 500)
        }
    }

    static async logout(req, res) {
        try {
            const token = req.token;
            await RefreshToken.destroy({ where: { access_token: token } });
            return res.success(req.__("Logout successfully"));
        } catch (error) {
            console.error('Logout error:', error);
            return res.error(error.message, null, 500);
        }
    }
}

module.exports = AuthController;
