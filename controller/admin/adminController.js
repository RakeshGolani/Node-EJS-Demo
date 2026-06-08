const bcrypt = require("bcryptjs");
const { Admin, Job } = require('../../models');
const handleFileUpload = require('../../utils/uploadFile');
const { validateRequiredFields } = require('../../utils/validator');
require("dotenv").config();
const path = require('path');
const fs = require('fs');
const { moveUploadedFile, deleteFile } = require('../../utils/fileUpload');
const { profileValidatorFields, changePassValidatorFields } = require('../../utils/admin/validatorRequiredFields');
const crypto = require('crypto');
const sendEmail = require('../../utils/admin/sendEmail');

class adminController {
    static async profile(req, res, next) {
        const admin = await Admin.findByPk(req.admin.id);
            if (!admin) {
                req.flash('failure', { message: res.__('Admin not found.') });
                res.redirect('/admin/login');
            }
            res.render('admin/profile/profile', {
            title: req.__('Profile'),
            breadcrumb: [],
            addNewButton: false,
            errors: {},
            error: null,
        });
    }

    static async updateProfile(req, res) {
        try {
            const { name, email, email_change, phone } = req.body;

            const fieldMap = { name: 'Name', email: 'Email', phone: 'Phone' };

            const adminId = req.admin.id;
            const errors = await profileValidatorFields(req.body, req, res, adminId);
            if (Object.keys(errors).length > 0) {
                const messages = Object.values(errors);
                req.flash('error_msg', messages.join(', '));
                return res.redirect('/admin/profile');
            }

            const admin = await Admin.findByPk(adminId);
            if (!admin) {
                req.flash('error_msg', req.__('Admin not found'));
                return res.redirect('profile');
            }

            // Handle email change request
            if (email_change === 'true' && email && email !== admin.email) {
                // Store new email temporarily
                admin.pending_email = email;

                // Generate verification token
                const token = crypto.randomBytes(32).toString('hex');
                admin.email_verification_token = token;
                // admin.email_verification_token_expires = Date.now() + 3600000; // 1 hour
                const emailTemplate = "admin/emails/email-verify-change";
                const data = {
                    'url' : `${process.env.APP_URL}/admin/verify-email-change/${token}`
                };
                const subject = res.__('Verify Email Change');
                // Render email template wthout job que
                //await sendEmail(res, emailTemplate, admin.name, email, data, subject);

                // Send email with job que
                await Job.create({
                    queue: "emails",
                    payload: {
                        emailTemplate,
                        userName: admin.name,
                        email,
                        data,
                        subject,
                    },
                });

                console.log("📩 Email verification job queued");
                }

            // Email check
            // if (email && email !== admin.email) {
            //     const existingUser = await Admin.findOne({ where: { email } });
            //     if (existingUser && existingUser.id !== admin.id) {
            //         req.flash('error_msg', req.__('Email already exists for another user'));
            //         return res.redirect('profile');
            //     }
            // }

            if (req.files?.profile_image?.[0]) {
                deleteFile(admin.profile_image);
                const profileUrl = await moveUploadedFile(req.files.profile_image[0], 'admins/profile', admin.id, 'profile');
                if (profileUrl) {
                    admin.profile_image = profileUrl;
                }
            }

            // Handle image
            // if (req.files.profile_image) {
            //     if (admin.profile_image && admin.profile_image !== '/admin/assets/img/avatars/default.png') {
            //         // Delete profile image if it exists
            //         if (fs.existsSync(user.profile_image)) {
            //             fs.unlinkSync(user.profile_image);
            //         }
            //     }
            //     admin.profile_image = req.files.profile_image[0].path.replace(/\\/g, '/');
            // }

            admin.name = name;
            admin.phone = phone;

            await admin.save();
            req.session.admin = admin;

            req.flash('success_msg', email_change === 'true' && email !== admin.email 
                ? req.__('Profile updated. Please verify your new email address') 
                : req.__('Profile updated successfully'));
            return res.redirect('/admin/profile');

        } catch (err) {
            console.error(err);
            req.flash('error_msg', req.__('Something went wrong'));
            return res.redirect('admin/profile');
        }
    }

    static async changeEmailVerify(req, res) {
        try {
            const { token } = req.params;

            const admin = await Admin.findOne({
                where: { email_verification_token: token },
            });

            if (!admin) {
                req.flash('failure', res.__('Invalid or expired token'));
                return res.redirect('/admin/profile');
            }

            // Move pending_email → email
            if (admin.pending_email) {
                admin.email = admin.pending_email;
                admin.pending_email = null;
            }

            admin.email_verification_token = null;
            // admin.email_verification_token_expires = null;

            await admin.save();

            req.logout(() => {
                req.flash('success_msg', res.__('Email changed successfully. Please log in again'));
                req.session.save(() => res.redirect('/admin/login'));
            });
        } catch (error) {
            console.error(error);
            req.flash('failure', res.__('An error occurred while changing the email. Please try again later'));
            return res.redirect('/admin/profile');
        }
    }

    static async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const fieldMap = { currentPassword: 'Current Password', newPassword: 'New Password', confirmPassword: 'Confirm Password' };

            const errors = await changePassValidatorFields(req.body, req, res);
            if (Object.keys(errors).length > 0) {
                const messages = Object.values(errors);
                req.flash('error_msg', messages.join(', '));
                return res.redirect('/admin/profile');
            }

            const adminId = req.admin.id;
            const admin = await Admin.findByPk(adminId);

            if (!admin) {
                req.flash('error_msg', req.__('Admin not found'));
                return res.redirect('/admin/profile');
            }

            const isMatch = await bcrypt.compare(currentPassword, admin.password);
            if (!isMatch) {
                req.flash('error_msg', req.__('Current password is incorrect.'));
                return res.redirect('/admin/profile');
            }

            // Hash and update password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            admin.password = hashedPassword;

            await admin.save();
            
            req.logout(() => {
                req.flash('success_msg', res.__('Password changed successfully. Please log in again'));
                req.session.save(() => res.redirect('/admin/login'));
            });

        } catch (err) {
            console.error(err);
            req.flash('error_msg', req.__('Something went wrong'));
            return res.redirect('/admin/profile');
        }
    }
}

module.exports = adminController;