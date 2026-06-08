require("dotenv").config();
const { User } = require("../../../models");
const { userUpdateValidatorFields, changePasswordValidatorFields } = require("../../../utils/apiValidator/validatorRequiredFields");
const fs = require('fs');
const { moveUploadedFile, deleteFile } = require('../../../utils/fileUpload');
const bcrypt = require("bcryptjs");

class customerController {

    /* static async me(req, res) {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId, {
                attributes: ["id", "name", "email", "phone", "address", "latitude", "longitude", "profile_image", "status", "createdAt"],
            });

            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const profileImageUrl = user.profile_image ? `${baseUrl}${user.profile_image}` : null;
            res.json({
                status: true, 
                message: req.__("User data fetched successfully"), 
                data: { 
                    ...user.toJSON(), 
                    profile_image: profileImageUrl 
                }, 
            });
        } catch (err) {
            return res.status(500).json({ status: false, message: err.message });
        }
    } */
    /* static async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const { name, email, phone, address, latitude, longitude } = req.body;

            // Validate required fields
            const errors = await userUpdateValidatorFields (req.body, req, res);
            if (Object.keys(errors).length > 0) {
                return res.status(400).json({ status: false, errors });
            }

            const user = await User.findByPk(userId, {
                attributes: ['id', 'name', 'email', 'phone', 'address', 'latitude', 'longitude', 'profile_image'],
            });

            if (!user) {
                return res.status(404).json({ status: false, message: req.__("User not found") });
            }

            // if (email && email !== user.email) {
            //     const existingUser = await User.findOne({ where: { email } });
            //     if (existingUser && existingUser.id !== user.id) {
            //         return res.status(400).json({ status:false, message: req.__("Email already exists for another user")});
            //     }
            // }

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

            user.name = name || user.name;
            user.email = email || user.email;
            user.phone = phone || user.phone;
            user.address = address || user.address;
            user.latitude = latitude || user.latitude;
            user.longitude = longitude || user.longitude;

            await user.save();
            
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const profileImageUrl = user.profile_image ? `${baseUrl}${user.profile_image}` : null;
            res.json({
                status:true, 
                message: req.__("Profile updated successfully"),
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    latitude: user.latitude,
                    longitude: user.longitude,
                    profile_image: profileImageUrl,
                }, 
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ status: false, message: err.message });
        }
    } */
    /* static async changePassword(req, res) {
        try {
            const userId = req.user.id;
            const { current_password, new_password } = req.body;

            // Validate required fields
            const errors = await changePasswordValidatorFields (req, res);
            if (Object.keys(errors).length > 0) {
                return res.status(400).json({ status: false, errors });
            }

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ status: false, message: req.__("User not found") });
            }

            const isPasswordValid = await bcrypt.compare(current_password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ status: false, message: req.__("Invalid current password") });
            }

            const isNewPasswordValid = await bcrypt.compare(new_password, user.password);
            if (isNewPasswordValid) {
                return res.status(400).json({ status: false, message: req.__("New password must be different from current password") });
            }

            user.password = await bcrypt.hash(new_password, 10);
            await user.save();

            res.json({ status: true, message: req.__("Password changed successfully") });
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    } */
    static async me(req, res) {
        try {
            const user = req.user;
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const profileImageUrl = user.profile_image ? `${baseUrl}${user.profile_image}` : null;
            const getUserData = {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                latitude: user.latitude,
                longitude: user.longitude,
                profile_image: profileImageUrl,
                status: user.status,
                createdAt: user.createdAt,
            }
            return res.success(req.__("User data fetched successfully"), getUserData, 200);
        } catch (error) {
            console.error(error);
            return res.error(error.message, null, 500);
        }
    }

    static async updateProfile(req, res) {
        try {
            const { name, email, phone, address, latitude, longitude } = req.body;
            const user = req.user;

            // Validate required fields
            const errors = await userUpdateValidatorFields (req.body, req, res);
            if (Object.keys(errors).length > 0) {
                return res.status(400).json({ status: false, errors });
            }

            if (!user) {
                return res.error(req.__("User not found", 500));
            }

            // if (email && email !== user.email) {
            //     const existingUser = await User.findOne({ where: { email } });
            //     if (existingUser && existingUser.id !== user.id) {
            //         return res.status(400).json({ status:false, message: req.__("Email already exists for another user")});
            //     }
            // }

            if (req.files?.profile_image?.[0]) {
                deleteFile(user.profile_image);
                const profileUrl = await moveUploadedFile(req.files.profile_image[0], 'admins/users', user.id, 'profile');
                if (profileUrl) {
                    user.profile_image = profileUrl;
                }
            }

            user.name = name || user.name;
            user.email = email || user.email;
            user.phone = phone || user.phone;
            user.address = address || user.address;
            user.latitude = latitude || user.latitude;
            user.longitude = longitude || user.longitude;

            await user.save();
            
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const profileImageUrl = user.profile_image ? `${baseUrl}${user.profile_image}` : null;

            const updatedUserData = {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                latitude: user.latitude,
                longitude: user.longitude,
                profile_image: profileImageUrl,
                status: user.status,
                createdAt: user.createdAt,
            }
            return res.success(req.__("Profile updated successfully"), updatedUserData, 200);
        } catch (error) {
            console.error(error);
            return res.error(error.message, null, 500);
        }
    }
    static async changePassword(req, res) {
        try {
            const { current_password, new_password } = req.body;
            const user = req.user;

            // Validate required fields
            const errors = await changePasswordValidatorFields (req, res);
            if (Object.keys(errors).length > 0) {
                return res.status(400).json({ status: false, errors });
            }

            if (!user) {
                return res.error(req.__("User not found"), 403);
            }

            const isPasswordValid = await bcrypt.compare(current_password, user.password);
            if (!isPasswordValid) {
                return res.error(req.__("Invalid current password"), 400);
            }

            const isNewPasswordValid = await bcrypt.compare(new_password, user.password);
            if (isNewPasswordValid) {
                return res.error(req.__("New password must be different from current password"), 400);
            }

            user.password = await bcrypt.hash(new_password, 10);
            await user.save();

            return res.success(req.__("Password changed successfully"));
        } catch (error) {
            return res.error(error.message, null, 500);
        }
    }
}

module.exports = customerController;