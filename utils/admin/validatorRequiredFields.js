const validator = require('validator');
const { User, Admin } = require('../../models');
const { Op } = require('sequelize');
const { isValidPhoneNumber } = require('libphonenumber-js');

const profileValidatorFields = async (data, req, res, adminId, next) => {
    const errors = {};

    if (!data.name) {
        errors.name = req.__("The name is required");
    } else if (data.name.length < 2) {
        errors.name = req.__("Name must be at least 2 characters long");
    } else if (data.name.length > 50) {
        errors.name = req.__("Name must be at most 50 characters long");
    } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ\u0600-\u06FF\s]+$/.test(data.name)) {
        errors.name = req.__("Name must contain only letters and spaces");
    }

    if (!data.email) {
        errors.email = req.__("The email is required");
    } else if (!validator.isEmail(data.email)) {
        errors.email = req.__("The email is not valid");
    } else if (data.email){
        const existingTeam = await Admin.findOne({ 
            where:{ email: data.email, id: { [Op.ne]: adminId } }
        });
        if (existingTeam) {
            errors.email = req.__("Email already exists for another user");
        }
    }

    if (!data.phone) {
        errors.phone = req.__("The phone number is required");
    } else if (isValidPhoneNumber(data.phone) === false) {
        errors.phone = req.__("The phone number is not valid");
    } else if (data.phone) {
        const existingPhone = await Admin.findOne({ 
            where: { phone: data.phone, id: { [Op.ne]: adminId } } 
        });
        if (existingPhone) {
            errors.phone = req.__("Phone already exists for another user");
        }
    }

    return errors;
}

const changePassValidatorFields = async (data, req, res, next) => {
    const errors = {};

    if (!data.currentPassword) {
        errors.currentPassword = req.__("Current password is required");
    } else if (data.currentPassword.length < 8) {
        errors.currentPassword = req.__("The password must be at least 8 characters long");
    } else if (data.currentPassword.length > 20) {
        errors.currentPassword = req.__("The password must be at most 20 characters long");
    }

    if (!data.newPassword) {
        errors.newPassword = req.__("New password is required");
    } else if (data.newPassword.length < 8) {
        errors.newPassword = req.__("The password must be at least 8 characters long");
    } else if (data.newPassword.length > 20) {
        errors.newPassword = req.__("The password must be at most 20 characters long");
    }

    if (data.newPassword !== data.confirmPassword) {
        errors.confirmPassword = req.__("The new password and its confirm password are not the same")
    }

    return errors;
}

const addUserValidatorFields = async (data, req, res, next) => {
    const errors = {};

    if (!data.name) {
        errors.name = req.__("The name is required");
    } else if (data.name.length < 2) {
        errors.name = req.__("Name must be at least 2 characters long");
    } else if (data.name.length > 50) {
        errors.name = req.__("Name must be at most 50 characters long");
    } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ\u0600-\u06FF\s]+$/.test(data.name)) {
        errors.name = req.__("Name must contain only letters and spaces");
    }

    if (!data.email) {
        errors.email = req.__("The email is required");
    } else if (!validator.isEmail(data.email)) {
        errors.email = req.__("The email is not valid");
    } else if (data.email){
        const existingTeam = await User.findOne({ 
            where:{ email: data.email } 
        });
        if (existingTeam) {
            errors.email = req.__("Email already exists for another user");
        }
    }
    
    if (!data.phone) {
        errors.phone = req.__("The phone number is required");
    } else if (isValidPhoneNumber(data.phone) === false) {
        errors.phone = req.__("The phone number is not valid");
    } else if (data.phone) {
        const existingPhone = await User.findOne({ 
            where: { phone: data.phone } 
        });
        if (existingPhone) {
            errors.phone = req.__("Phone already exists for another user");
        }
    }

    if (!data.address) {
        errors.address = req.__("The address is required");
    }

    if (!data.password) {
        errors.password = req.__("The password is required");
    }

    return errors;
}

const updateUserValidatorFields = async (data, req, res, userId, next) => {
    const errors = {};

    if (!data.name) {
        errors.name = req.__("The name is required");
    } else if (data.name.length < 2) {
        errors.name = req.__("Name must be at least 2 characters long");
    } else if (data.name.length > 50) {
        errors.name = req.__("Name must be at most 50 characters long");
    } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ\u0600-\u06FF\s]+$/.test(data.name)) {
        errors.name = req.__("Name must contain only letters and spaces");
    }

    if (!data.email) {
        errors.email = req.__("The email is required");
    } else if (!validator.isEmail(data.email)) {
        errors.email = req.__("The email is not valid");
    } else if (data.email){
        const existingTeam = await User.findOne({ 
            where:{ email: data.email, id: { [Op.ne]: userId } }
        });
        if (existingTeam) {
            errors.email = req.__("Email already exists for another user");
        }
    }
    
    if (!data.phone) {
        errors.phone = req.__("The phone number is required");
    } else if (isValidPhoneNumber(data.phone) === false) {
        errors.phone = req.__("The phone number is not valid");
    } else if (data.phone) {
        const existingPhone = await User.findOne({ 
            where: { phone: data.phone, id: { [Op.ne]: userId } } 
        });
        if (existingPhone) {
            errors.phone = req.__("Phone already exists for another user");
        }
    }

    if (!data.address) {
        errors.address = req.__("The address is required");
    }

    return errors;
}



const addFaqValidatorFields = async (req, res, next) => {
    const errors = {};

    const data = req.body;
    if (!data.role) {
        errors.role = req.__("The role is required");
    }

    if (!data.question) {
        errors.question = req.__("The question is required");
    }

    if (!data.answer) {
        errors.answer = req.__("The answer is required");
    }

    return errors;
}

const updateFaqValidatorFields = async (req, res, next) => {
    const errors = {};
    
    const data = req.body;
    if (!data.role) {
        errors.role = req.__("The role is required");
    }

    if (!data.question) {
        errors.question = req.__("The question is required");
    }

    if (!data.answer) {
        errors.answer = req.__("The answer is required");
    }

    return errors;
}

const updateCmsValidatorFields = async (req, res, next) => {
    const errors = {};

    const data = req.body;
    if (!data.name) {
        errors.name = req.__("The name is required");
    } else if (data.name.length < 2) {
        errors.name = req.__("Name must be at least 2 characters long");
    } else if (data.name.length > 50) {
        errors.name = req.__("Name must be at most 50 characters long");
    } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ\u0600-\u06FF\s]+$/.test(data.name)) {
        errors.name = req.__("Name must contain only letters and spaces");
    }

    if (!data.name_ar) {
        errors.name_ar = req.__("The name ar is required");
    } else if (data.name_ar.length < 2) {
        errors.name_ar = req.__("Name ar must be at least 2 characters long");
    } else if (data.name_ar.length > 50) {
        errors.name_ar = req.__("Name ar must be at most 50 characters long");
    } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ\u0600-\u06FF\s]+$/.test(data.name_ar)) {
        errors.name_ar = req.__("Name ar must contain only letters and spaces");
    }

    return errors;
}

const appSettingValidatorFields = async (req, res, next) => {
    const errors = {};
    const { setting, setting_password } = req.body;

    // if (!setting || typeof setting !== 'object' || Object.keys(setting).length === 0) {
    //     errors.setting = "At least one app setting is required.";
    // }

    if (setting && typeof setting === 'object') {
        for (const [key, value] of Object.entries(setting)) {
            if (!value || value.trim() === '') {
                // Convert snake_case to Title Case
                const formattedKey = key
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                errors[`setting_${key}`] = `The ${formattedKey} field cannot be empty.`;
            }
        }
    }

    if (!setting_password) {
        errors.setting_password = "The setting password field is required.";
    }

    return errors;
};



module.exports = {
    profileValidatorFields,
    changePassValidatorFields,
    addUserValidatorFields,
    updateUserValidatorFields,
    addFaqValidatorFields,
    updateFaqValidatorFields,
    updateCmsValidatorFields,
    appSettingValidatorFields,
}