const { sendOtpValidatorFields } = require("../../utils/apiValidator/validatorRequiredFields");
const { User, Otp, AppSetting } = require("../../models");
class commonController {

    static async initGet(req, res) {
        try {
            const { type, app_version } = req.params;

            if (!type || !app_version) {
                return res.status(400).json({ status: false, message: "Invalid parameters" });
            }

            // Fetch maintenance mode setting
            const maintenanceMode = await AppSetting.findOne({
                attributes: ['compulsory'],
                where: { app_name: 'maintenance_mode' },
            });

            if (maintenanceMode && maintenanceMode.compulsory == 'yes') {
                return res.status(503).json({
                    status: false,
                    message: "The application is currently under maintenance. Please try again later.",
                });
            }

            // Fetch version info for the app (android/ios/etc.)
            const appVersionInfo = await AppSetting.findOne({
                attributes: ['compulsory', 'setting'],
                where: { app_name: type },
            });
                
             if (appVersionInfo.compulsory == 'yes' && appVersionInfo.setting > app_version) {
                return res.status(426).json({
                    status: false,
                    message: "A newer version is required. Please update to continue.",
                });
            } else if (appVersionInfo.compulsory == 'no' && appVersionInfo.setting < app_version) {
                return res.status(200).json({
                    status: true,
                    message: "You are using the latest version of the app.",
                });
            }

            return res.status(200).json({
                status: true,
                message: "Initialization successful",
                data: {
                    type,
                    current_version: app_version,
                    maintenance_mode: maintenanceMode ? maintenanceMode.compulsory : false,
                    latest_version: appVersionInfo ? appVersionInfo.setting : null,
                    force_update: appVersionInfo ? appVersionInfo.compulsory : false,
                    base_url: process.env.APP_URL || null,
                    google_map_key: process.env.GOOGLE_MAP_KEY || null,
                    app_env: process.env.APP_ENV || 'development',
                    time:  new Date().toISOString(),
                }
            });
        } catch (err) {
            console.error("initGet Error:", err);
            return res.status(500).json({
                status: false,
                message: "Internal server error",
                error: err.message,
            });
        }
    }

    static async sendOtp(req, res) {
        try {
            const { phone, type, otp_type } = req.body;

            const errors = await sendOtpValidatorFields(req, res);
            if (Object.keys(errors).length > 0) {
                return res.status(400).json({ status: false, errors });
            }

            const otp = Math.floor(100000 + Math.random() * 900000);
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

            if (otp_type === 'login') {
                if (type === 'customer') {
                    const user = await User.findOne({ where: { phone } });

                    if (!user) {
                        return res.status(404).json({
                            status: false,
                            code: 404,
                            message: req.__("Login phone not found")
                        });
                    }

                    // Create or update OTP
                    await Otp.upsert({
                        phone: phone,
                        otp: otp,
                        otp_code_expiry: expiresAt,
                        is_verified: false,
                        verified_at: null,
                    });

                    return res.status(200).json({
                        status: true,
                        message: req.__("OTP sent successfully"),
                        data: {
                            phone,
                            otp,
                            otp_type,
                            type,
                        }
                    });
                }
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ status: false, message: err.message });
        }
    }
}

module.exports = commonController;
