const { datatableLoad } = require('../../../utils/datatable');
const { Cms } = require('../../../models');
const renderPage = require('../../../utils/render');
const { updateCmsValidatorFields } = require("../../../utils/admin/validatorRequiredFields");
const moment = require("moment-timezone");
class cmsController {
    static async index(req, res) {
        renderPage(res, 'cms/index', {
            currentRoute: '/admin/cms',
            title: req.__('CMS'),
            breadcrumb: [],
            addNewButton: false,
            errors: {},
            error: null,
        });
    }

    static async getData(req, res) {
        try {
            const cms = await datatableLoad(req, Cms, ['name', 'content']);

            cms.data = cms.data.map(row => {
                const u = row.toJSON ? row.toJSON() : row; // handle Sequelize objects
                u.createdAt = moment(u.createdAt).tz(process.env.APP_TIMEZONE).format(process.env.DATE_TIME_FORMAT);
                return u;
            });

            res.json(cms);
        } catch (err) {
            console.error('Error loading data:', err);
            return res.status(500).json({ status: false, message: err.message });
        }
    }

    static async getDetails (req, res) {
        try {
            const cmsId = req.params.id;
            const cms = await Cms.findByPk(cmsId);

            if (!cms) {
                return res.status(404).json({ status: false, message: req. __('CMS not found') });
            }

            return res.status(200).json({ status: true, data: cms });
        } catch (err) {
            console.error('Error loading data:', err);
            return res.status(500).json({ status: false, message: err.message });
        }
    }

    static async updateCms(req, res) {
        try {
            const cmsId = req.params.id;
            const { name, name_ar, content, content_ar } = req.body;

            // Optional: You can re-enable validation if needed
            const errors = await updateCmsValidatorFields(req, res);
            if (Object.keys(errors).length > 0) {
                return res.status(422).json({ status: false, errors });
            }

            const cms = await Cms.findByPk(cmsId);
            if (!cms) {
                return res.status(404).json({ status: false, message: req.__('CMS not found') });
            }

            await cms.update({ name, name_ar, content, content_ar });
            return res.status(200).json({ status: true, message: req.__('CMS updated successfully') });

        } catch (err) {
            console.error('Error loading data:', err);
            return res.status(500).json({ status: false, message: err.message });
        }
    }

    static async getDetailsView(req, res) {
        try {
            const cmsId = req.params.id;
            const cms = await Cms.findByPk(cmsId);
            
            renderPage(res, 'cms/details', {
                currentRoute: '/admin/cms',
                title: req.__('CMS Details'),
                breadcrumb: [
                    { title: req.__('CMS'), link: '/admin/cms'}
                ],
                addNewButton: false,
                cms: cms,
                errors: {},
                error: null,
            });
        } catch (err) {
            console.error('Error creating user:', error);
            req.flash('error_msg', req.__('Failed to create user. Please try again.'));
            return res.redirect('/admin/cms');
        }
    }
}

module.exports = cmsController;