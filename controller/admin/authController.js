const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Admin } = require('../../models');
const { validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

class AuthController 
{
    static login(req, res) {
        res.render('admin/login', {
            layout:'admin/layouts/main',
            title: req.__('Login'),
            errors: req.flash('errors')[0] || {},
            old: req.flash('old')[0] || {}
        });
    }

    // static loginPost(req, res, next)
    // {
    //     console.log(req.body);
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return res.render('admin/login', {
    //             errors: errors.array(),
    //             error: null,
    //             oldInput: { email: req.body.email }
    //         });
    //     } else {
    //         User.findOne({ email: req.body.email })
    //             .then(user => {
    //                 if (!user) {
    //                     return res.render('admin/login', {
    //                         errors: {},
    //                         error: 'Email or password is incorrect',
    //                         oldInput: { email: req.body.email }
    //                     });
    //                 }
    //                 bcrypt.compare(req.body.password, user.password)
    //                     .then(doMatch => {
    //                         if (doMatch) {
    //                             req.session.isLoggedIn = true;
    //                             req.session.user = user;
    //                             return req.session.save
    //                                 (err => {
    //                                     console.log(err);
    //                                     res.redirect('/admin/dashboard');
    //                                 });
    //                         }
    //                         return res.render('admin/login', {
    //                             errors: {},
    //                             error: 'Email or password is incorrect',
    //                             oldInput: { email: req.body.email }
    //                         });
    //                     })
    //                     .catch(err => {
    //                         console.log(err);
    //                     });
    //             })
    //             .catch(err => {
    //                 console.log(err);
    //                 return res.render('admin/login', {
    //                     errors: {},
    //                     error: 'Email or password is incorrect',
    //                     oldInput: { email: req.body.email }
    //                 });
                    

    //         });
    //     }
    // }

    static loginPost(req, res, next) {
        try {
            // const errors = validationResult(req);
            // let errorObj = {};

            // if (!errors.isEmpty()) {
            //     errors.array().forEach(err => {
            //     errorObj[err.path] = err.msg;
            //     });

            //     return res.render('admin/login', {
            //     errors: errorObj,
            //     error: null,
            //     oldInput: { email: req.body.email }
            //     });
            // }

            //req.body.role = 'admin';
            passport.authenticate('local', (err, admin, info) => {
                if (err) return next(err);
                if (!admin) {
                    req.flash('error_msg', req.__('Email or password is incorrect'));
                    return res.redirect('/admin/login');
                }

                req.logIn(admin, (err) => {
                if (err) return next(err);
                    req.session.admin = admin; // Optional, for convenience

                    // Dynamically set session cookie duration based on "Remember Me"
                    if (req.body.remember_me) {
                        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
                    }
                    
                    req.flash('success_msg', req.__('Welcome back! %s', admin.name));
                    return res.redirect('/admin/dashboard');
                });
            })(req, res, next);
        } catch (err) {
            req.flash('error_msg', err.message);
            req.flash('old', req.body);
            res.redirect('/admin/login');
        }
    }

    static logout(req, res, next) {
        req.logout(err => {
            if (err) return next(err);
            req.flash('success_msg', req.__('You have logged out successfully!'));
            req.session.save(() => res.redirect('/admin/login'));
        });
    }

    // static async forgotPassword(req, res) {
    //     const { email } = req.body;

    //     try {
    //     const user = await User.findOne({ where: { email } });

    //     if (!user) {
    //         req.flash('error_msg', 'Email not found');
    //         return res.redirect('/admin/login');
    //     }

    //     // Generate a reset token
    //     const resetToken = crypto.randomBytes(32).toString('hex');
    //     const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    //     // Save token and expiry in user record
    //     user.resetToken = resetToken;
    //     user.resetTokenExpiry = resetTokenExpiry;
    //     await user.save();

    //     // Send email
    //     const transporter = nodemailer.createTransport({
    //         service: 'Gmail',
    //         auth: {
    //             user: process.env.SMTP_USER,
    //             pass: process.env.SMTP_PASSWORD,
    //         },
    //     });

    //     const resetUrl = `http://${req.headers.host}/admin/reset-password?token=${resetToken}`;

    //     const mailOptions = {
    //         to: user.email,
    //         from: process.env.SMTP_USER,
    //         subject: 'Password Reset',
    //         html: `
    //         <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5;">
    //             <p>You requested a password reset.</p>
    //             <p>
    //             Click this <a href="${resetUrl}" style="color: #0d9394;">link</a> to reset your password.
    //             </p>
    //             <p>This link will expire in 1 hour.</p>
    //         </div>
    //         `,
    //     };

    //     await transporter.sendMail(mailOptions);

    //     req.flash('success_msg', 'Password reset email sent');
    //     res.redirect('/admin/login');

    //     } catch (err) {
    //     console.error(err);
    //     req.flash('error_msg', 'Something went wrong');
    //     res.redirect('/admin/login');
    //     }
    // }

    static async forgotPassword(req, res) {
        const { email } = req.body;

        try {
            const user = await Admin.findOne({ where: { email } });

            if (!user) {
                req.flash('error_msg', req.__('Email not found'));
                return res.redirect('/admin/login');
            }

            // Generate a reset token
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpiry = Date.now() + 3600000; // 1 hour

            // Save token and expiry in user record
            user.resetToken = resetToken;
            user.resetTokenExpiry = resetTokenExpiry;
            await user.save();

            // Send email
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD,
                },
            });

            const resetUrl = `http://${req.headers.host}/admin/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

            // Render email template to string
            res.render('admin/emails/reset-password', {
                layout: 'admin/layouts/emails',
                resetUrl,
                userName: user.name || 'User',
            }, async (err, html) => {
                if (err) {
                    console.error('Error rendering email template:', err);
                    req.flash('error_msg', req.__('Failed to send email'));
                    return res.redirect('/admin/login');
                }

                const mailOptions = {
                    to: user.email,
                    from: process.env.SMTP_USER,
                    subject: 'Password Reset',
                    html: html,
                };

                try {
                    await transporter.sendMail(mailOptions);
                    req.flash('success_msg', req.__('Password reset email sent successfully'));
                    res.redirect('/admin/login');
                } catch (mailErr) {
                    console.error('Error sending email:', mailErr);
                    req.flash('error_msg', req.__('Failed to send email'));
                    res.redirect('/admin/login');
                }
            });

        } catch (err) {
            console.error(err);
            req.flash('error_msg', req.__('Something went wrong'));
            res.redirect('/admin/login');
        }
    }

    static showResetPasswordForm(req, res) {
        res.render('admin/reset-password', {
            layout:'admin/layouts/main',
            token: req.query.token || '',
            email: req.query.email || '',
            title: req.__('Reset Password'),
            errors: {},
            error: null,
            old: req.flash('old')[0] || {}
        });
    }

    static async resetPassword(req, res) {
        const { password, confirmPassword } = req.body;
        const { token } = req.query;

        // console.log('Reset Password Token:', token);

        try {
        if (!token) {
            req.flash('error_msg', req.__('Invalid or missing token'));
            return res.redirect('/admin/login');
        }

        const user = await Admin.findOne({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    [Op.gt]: Date.now(), // ensure token is not expired
                },
            },
        });

        if (!user) {
            req.flash('error_msg', req.__('Invalid or expired token'));
            return res.redirect('/admin/login');
        }

        if (password !== confirmPassword) {
            req.flash('error_msg', req.__('Passwords do not match'));
            return res.redirect(`/admin/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`);
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        req.flash('success_msg', req.__('Your password has been reset successfully. Please log in with your new password.'));
        return res.redirect('/admin/login');

        } catch (err) {
        console.error('Reset Password Error:', err);
        req.flash('error_msg', req.__('Something went wrong'));
        return res.redirect('/admin/login');
        }
    }
}

module.exports = AuthController;