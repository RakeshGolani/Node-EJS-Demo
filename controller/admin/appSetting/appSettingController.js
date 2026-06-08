const renderPage = require('../../../utils/render');
const { AppSetting } = require('../../../models');
const { appSettingValidatorFields } = require('../../../utils/admin/validatorRequiredFields');
class appSettingController {

    static async index(req, res) {
        const appSettings = await AppSetting.findAll({ order: [['app_name', 'ASC']] });
        renderPage(res, 'appSetting/app-setting', {
            title: 'App Setting',
            breadcrumb: [],
            addNewButton: false,
            appSettings,
            old: req.body, // old data
            errors: {},
            error: null,
        });
    }

    static async updateAppSetting(req, res) {
    const { setting, setting_password } = req.body;

        try {
            // Optional validation call — remove if not needed
            const errors = await appSettingValidatorFields(req, res);
            if (Object.keys(errors).length > 0) {
                const messages = Object.values(errors);
                req.flash('error_msg', messages.join(', '));
                return res.redirect('/admin/app-settings');
            }

            // Check password
            if (!setting_password || setting_password !== process.env.APP_SETTING_PASSWORD) {
                req.flash('error_msg', 'Password is incorrect');
                return res.redirect('/admin/app-settings');
            }

            // Update settings
            if (setting && typeof setting === 'object') {
                const compulsoryMap = req.body.compulsory || {}; // Optional: checkbox values

                const updates = Object.entries(setting).map(async ([app_name, setting_value]) => {
                    const compulsory = compulsoryMap[app_name] ? 'yes' : 'no';

                    const appSetting = await AppSetting.findOne({ where: { app_name } });
                    if (appSetting) {
                        await appSetting.update({ setting: setting_value, compulsory });
                    }
                });

                await Promise.all(updates);
            }

            req.flash('success_msg', 'App settings updated successfully.');
            return res.redirect('/admin/app-settings');

        } catch (error) {
            console.error('Update Error:', error);
            req.flash('error_msg', 'Failed to update app setting. Please try again.');
            return res.redirect('/admin/app-settings');
        }
    }

}

module.exports = appSettingController;