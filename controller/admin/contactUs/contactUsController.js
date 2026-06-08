const { datatableLoad } = require('../../../utils/datatable');
const { ContactUs } = require('../../../models');
const renderPage = require('../../../utils/render');
const moment = require("moment-timezone");
const { sendEmail } = require('../../../utils/admin/sendEmail');
const { parsePhoneNumber } = require('libphonenumber-js');

class contactUsController {
    static async index(req, res) {
        renderPage(res, 'contactUs/index', {
            currentRoute: '/admin/contact-us',
            title: req.__('Contact Us'),
            breadcrumb: [],
            addNewButton: false,
            errors: {},
            error: null,
        });
    }

    static async getData(req, res) {
        try {
            const contactUs = await datatableLoad(req, ContactUs, ['name', 'email', 'phone', 'message', 'is_replied']);

            // Format createdAt for each row
            contactUs.data = contactUs.data.map(row => {
                const u = row.toJSON ? row.toJSON() : row; // handle Sequelize objects
                u.createdAt = moment(u.createdAt).tz(process.env.APP_TIMEZONE).format(process.env.DATE_TIME_FORMAT);

                // Format phone number for display
                if (u.phone) {
                    try {
                        const phoneNumber = parsePhoneNumber(u.phone);
                        if (phoneNumber) {
                            u.phone = phoneNumber.formatInternational();
                        }
                    } catch (e) {
                        // Keep original if parsing fails
                    }
                }
                return u;
            });

            res.json(contactUs);
        } catch (err) {
            console.error('Error loading data:', err);
            return res.status(500).json({ status: false, message: err.message });
        }
    }

    static async storeReply(req, res) {
        try {
            const { id } = req.params;
            const { reply } = req.body;

            if (!reply) {
                return res.status(400).json({ status: false, message: req.__('Reply message is required') });
            }

            const contactUs = await ContactUs.findByPk(id);
            if (!contactUs) {
                return res.status(404).json({ status: false, message: req.__('Contact inquiry not found') });
            }

            contactUs.reply = reply;
            contactUs.is_replied = true;
            await contactUs.save();

            // Send email
            const subject = `${process.env.APP_NAME} - Reply to your inquiry`;
            const emailData = {
                message: contactUs.message,
                reply: reply
            };
            
            // Using a simple email template (I will create this next)
            await sendEmail(res, 'admin/emails/contact-us-reply', contactUs.name, contactUs.email, emailData, subject);

            return res.json({ status: true, message: req.__('Reply sent successfully') });
        } catch (err) {
            console.error('Error sending reply:', err);
            return res.status(500).json({ status: false, message: err.message });
        }
    }
}

module.exports = contactUsController;