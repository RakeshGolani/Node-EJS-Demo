const renderPage = require('../../../utils/render');
const { Faq } = require('../../../models');
const { datatableLoad } = require('../../../utils/datatable');
const { addFaqValidatorFields, updateFaqValidatorFields } = require("../../../utils/admin/validatorRequiredFields");
const moment = require("moment-timezone");
class faqController {
    static async index(req, res) {
        const faq = await Faq.findAll();

        // const locale = req.getLocale ? req.getLocale() : 'en';
        // if (locale === 'ar') {
        //     faq.forEach(faq => {
        //         faq.question = faq.question_ar || faq.question;
        //         faq.answer   = faq.answer_ar   || faq.answer;
        //     });
        // }

        renderPage(res, 'faq/details', { 
            title: req.__('FAQ'),
            breadcrumb: [],
            faq: faq,
            addNewButton: true,
            errors: {},
            error: null, 
        });
    }

    // static async index(req, res) {
    //     renderPage(res,'faq/index', { 
    //         currentRoute: '/admin/faqs',
    //         title: req.__('FAQ'),
    //         breadcrumb: [],
    //         addNewButton: true,
    //         errors: {},
    //         error: null, 
    //     });
    // }

    /* static async getData(req, res) {
        try {
            const faqs = await datatableLoad(req, Faq, ['role', 'question', 'answer'], {
                
            });

            // Format createdAt for each row
            faqs.data = faqs.data.map(row => {
                const u = row.toJSON ? row.toJSON() : row; // handle Sequelize objects
                u.createdAt = moment(u.createdAt).tz(process.env.APP_TIMEZONE).format(process.env.DATE_TIME_FORMAT);
                return u;
            });

            res.json(faqs);
        } catch (err) {
            console.error('Error loading data:', err);
            return res.status(500).json({ status: false, message: err.message });
        }
    } */

    static async storeFaq(req, res) {
        try {
            const { role, question, answer } = req.body;

            // Optional: You can re-enable validation if needed
            const errors = await addFaqValidatorFields(req, res);
            if (Object.keys(errors).length > 0) {
                return res.status(422).json({ status: false, errors });
            }

            const faq = await Faq.create({ role, question, answer });
            res.json({ status: true, message: req.__('FAQ created successfully') });
        } catch (err) {
            console.error('Error creating FAQ:', err);
            res.status(500).json({ status: false, message: err.message });
            
        }
    }

    static async getFaq (req, res) {
        try {
            const faqId = req.params.id;
            const faq = await Faq.findByPk(faqId);
            if (!faq) {
                return res.status(404).json({ status: false, message: req.__('FAQ not found') });
            }
            return res.status(200).json({ status: true, data: faq });
        } catch (err) {
            console.error('Error getting FAQ:', err);
            return res.status(500).json({ status: false, message: err.message });
        }
    }

    static async updateFaq (req, res) {
        try {
            const faqId = req.params.id;
            const { role, question, answer } = req.body;

            // Optional: You can re-enable validation if needed
            const errors = await updateFaqValidatorFields(req, res);
            if (Object.keys(errors).length > 0) {
                return res.status(422).json({ status: false, errors });
            }

            const faq = await Faq.findByPk(faqId);
            if (!faq) {
                return res.status(404).json({ status: false, message: req.__('FAQ not found') });
            }

            await faq.update({ role, question, answer });
            res.json({ status: true, message: req.__('FAQ updated successfully') });
        } catch (err) {
            console.error('Error updating FAQ:', err);
            res.status(500).json({ status: false, message: err.message });
        }
    }

    /* static async getFaqDetails(req, res) {
        try {
            const faqId = req.params.id;
            const faq = await Faq.findByPk(faqId);
            
            renderPage(res, 'faq/details', {
                currentRoute: '/admin/faqs',
                title: req.__('FAQ Details'),
                breadcrumb: [
                    { title: req.__('FAQ'), link: '/admin/faqs'}
                ],
                addNewButton: false,
                faq: faq,
                errors: {},
                error: null, 
            });
        } catch (error) {
            console.error('Error creating user:', error);
            req.flash('error_msg', req.__('Failed to create user. Please try again.'));
            return res.redirect('/admin/faqs');
        }
    } */
}

module.exports = faqController;