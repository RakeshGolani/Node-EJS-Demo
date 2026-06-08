const { datatableLoad } = require('../../../utils/datatable');
const { User,  } = require('../../../models/');
const renderPage = require('../../../utils/render');
const handleFileUpload = require('../../../utils/uploadFile');
const { validateRequiredFields } = require('../../../utils/validator');
const bcrypt = require('bcryptjs');
const { Op, where } = require('sequelize');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const { moveUploadedFile, deleteFile } = require('../../../utils/fileUpload');
const { addUserValidatorFields, updateUserValidatorFields } = require('../../../utils/admin/validatorRequiredFields');
const moment = require("moment-timezone");
const { parsePhoneNumber } = require('libphonenumber-js');

class UserController {
    static index(req, res) {
        renderPage(res, 'users/index', {
            currentRoute: '/admin/users',
            title: req.__('Users'),
            breadcrumb: [],
            addNewButton: true,
            errors: {},
            error: null,
        });
    }

    static async getData(req, res) {
        try {
            const result = await datatableLoad(req, User, ['name', 'email', 'phone'], {
                // Login user should not be able to see his own record
                // where: { id: { [Op.ne]: req.session.admin.id } },
            });

            // Format createdAt for each row
            result.data = result.data.map(row => {
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

            res.json(result);
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    }

    static async storeUser(req, res) {
        try {
            const { name, email, phone, address, latitude, longitude, password } = req.body;
            const fieldMap = { name: 'Name', email: 'Email', phone: 'Phone', address: 'Address', latitude: 'Latitude', longitude: 'Longitude', password: 'Password' };

            const errors = await addUserValidatorFields(req.body, req, res);
            if (Object.keys(errors).length > 0) {
                return res.status(422).json({ status: false, errors });
            }
            // if (Object.keys(errors).length > 0) {
            //     const messages = Object.values(errors);
            //     req.flash('error_msg', messages.join(', '));
            //     return res.redirect('/admin/users');
            // }

            // Email check
            // const existingUser = await User.findOne({ where: { email } });
            // if (existingUser) {
            //     req.flash('error_msg', req.__('Email already exists for another user'));
            //     return res.redirect('/admin/users');
            // }
            
            // Create new user
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
                name,
                email,
                phone,
                address,
                latitude,
                longitude,
                password: hashedPassword,
            };

            const createUser = await User.create(newUser);

            if (req.files?.profile_image?.[0]) {
                const profileUrl = await moveUploadedFile(req.files.profile_image[0], 'admins/users', createUser.id, 'profile');
                if (profileUrl) {
                    createUser.profile_image = profileUrl;
                    await createUser.save();
                }
            }

           return res.status(200).json({ status: true, message: req.__('User created successfully')});
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    }

    static async getUser(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findByPk(userId);
            if (!user) {
                req.flash('error_msg', req.__('User not found'));
                return res.redirect('/admin/users');
            }
            res.json(user);
        } catch (error) {
            return res.status(500).json({ status: false, message: err.message });
        }
    }

    static async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const { name, email, phone, address, latitude, longitude, password } = req.body;
            const fieldMap = { name: 'Name', email: 'Email', phone: 'Phone', address: 'Address', latitude: 'Latitude', longitude: 'Longitude' };

            const errors = await updateUserValidatorFields(req.body, req, res, userId);
            if (Object.keys(errors).length > 0) {
                return res.status(422).json({ status: false, errors });
            }

            // Email check (ensure no duplicate email for other users)
            // const existingUser = await User.findOne({ where: { email, id: { [Op.ne]: userId } } });
            // if (existingUser) {
            //     req.flash('error_msg', req.__('Email already exists for another user'));
            //     return res.redirect('/admin/users');
            // }

            // Find user to update
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ status: false, message: req.__('User not found') });
            }

            // Handle password update (only if provided)
            if (password && password.trim() !== '') {
                user.password = await bcrypt.hash(password, 10);
            }

            if (req.files?.profile_image?.[0]) {
                deleteFile(user.profile_image);
                const profileUrl = await moveUploadedFile(req.files.profile_image[0], 'admins/users', user.id, 'profile');
                if (profileUrl) {
                    user.profile_image = profileUrl;
                }
            }

            // Handle image upload
            // if (req.files.profile_image) {
            //     if (user.profile_image && user.profile_image !== '/admin/assets/img/avatars/default.png') {
            //         // Delete profile image if it exists
            //         if (fs.existsSync(user.profile_image)) {
            //             fs.unlinkSync(user.profile_image);
            //         }
            //     }
            //     user.profile_image = req.files.profile_image[0].path.replace(/\\/g, '/');
            // }

            user.name = name;
            user.email = email;
            user.phone = phone;
            user.address = address;
            user.latitude = latitude;
            user.longitude = longitude;

            // Perform update
            await user.save();

            return res.status(200).json({ status: true, message: req.__('User updated successfully') });
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    }

    static async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ failure: false, message: req.__('User not found') });
            }

            deleteFile(user.profile_image);

            // Delete profile image if it exists
            // if (user.profile_image && user.profile_image !== '/admin/assets/img/avatars/default.png') {
            //     if (fs.existsSync(user.profile_image)) {
            //         fs.unlinkSync(user.profile_image);
            //     }
            // }

            // Delete user record
            await user.destroy();
            return res.status(200).json({ success: true, message: req.__('User deleted successfully') });
        } catch (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ status: false, message: err.message });
        }
    }

    static async changeStatus(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ failure: false, message: req.__('User not found') });
            }

            // Toggle status
            user.status = user.status === 'active' ? 'inactive' : 'active';
            await user.save();

            return res.status(200).json({ success: true, message: req.__('User status updated to: '), status: user.status });
        } catch (err) {
            console.error('Error changing user status:', err);
            return res.status(500).json({ status: false, message: err.message });
        }
    }
}

module.exports = UserController;
