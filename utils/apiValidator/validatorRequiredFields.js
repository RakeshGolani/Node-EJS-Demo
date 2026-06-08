const validator = require('validator');
const { User } = require('../../models');
const { isValidPhoneNumber } = require('libphonenumber-js');

const userRegisterValidatorFields  = async (data, req, res) => {
    const errors = {};
    
    if (!data.name) {
        errors.name = req.__("The name is required");
    } else if (data.name.length < 3) {
        errors.name = req.__("Name must be at least 3 characters long");
    }

    if (!data.email) {
        errors.email = req.__("The email is required");
    } else if (!validator.isEmail(data.email)) {
        errors.email = req.__("The email is not valid");
    } else {
        const existingUser = await User.findOne({ where:{ email: data.email } });
        if (existingUser) {
            errors.email = req.__("Email already exists for another user");
        }
    }

    if (!data.phone) {
        errors.phone = req.__("The phone number is required");
    } else if (isValidPhoneNumber(data.phone) === false) {
        errors.phone = req.__("The phone number is not valid");
    } else {
        const existingPhone = await User.findOne({ where: { phone: data.phone } });
        if (existingPhone) {
            errors.phone = "Phone already exists for another user";
        }
    }

    if (!data.address) {
        errors.address = req.__("The address is required");
    }

    if (!data.latitude) {
        errors.latitude = req.__("The latitude is required");
    }

    if (!data.longitude) {
        errors.longitude = req.__("The longitude is required");
    }

    if (!data.password) {
        errors.password = req.__("The password is required");
    } else if (data.password.length < 8) {
        errors.password = req.__("The password must be at least 8 characters long");
    } else if (data.password.length > 20) {
        errors.password = req.__("The password must be at most 20 characters long");
    }

    return errors;
};

const userUpdateValidatorFields = async (data, req, res) => {
    const errors = {};

    if (!data.name) {
        errors.name = req.__("The name is required");
    } else if (data.name.length < 3) {
        errors.name = req.__("Name must be at least 3 characters long");
    }

    if (!data.email) {
        errors.email = req.__("The email is required");
    } else if (!validator.isEmail(data.email)) {
        errors.email = req.__("The email is not valid");
    }

    if (!data.phone) {
        errors.phone = req.__("The phone number is required");
    } else if (isValidPhoneNumber(data.phone) === false) {
        errors.phone = req.__("The phone number is not valid");
    }

    if (!data.address) {
        errors.address = req.__("The address is required");
    }

    if (!data.latitude) {
        errors.latitude = req.__("The latitude is required");
    }

    if (!data.longitude) {
        errors.longitude = req.__("The longitude is required");
    }

    return errors;
}


const changePasswordValidatorFields = async (req, res) => {
    const errors = {};
    const data = req.body;

    if (!data.current_password) {
        errors.current_password = req.__("The current password is required");
    } else if (data.current_password.length < 8) {
        errors.current_password = req.__("The current password must be at least 8 characters long");
    } else if (data.current_password.length > 20) {
        errors.current_password = req.__("The current password must be at most 20 characters long");
    }

    if (!data.new_password) {
        errors.new_password = req.__("The new password is required");
    } else if (data.new_password.length < 8) {
        errors.new_password = req.__("The new password must be at least 8 characters long");
    } else if (data.new_password.length > 20) {
        errors.new_password = req.__("The new password must be at most 20 characters long");
    }

    return errors;
};

const sendOtpValidatorFields = async (req, res) => {
    const errors = {};
    const data = req.body;

    if (!data.phone) {
        errors.phone = req.__("The phone number is required");
    } else if (isValidPhoneNumber(data.phone) === false) {
        errors.phone = req.__("The phone number is not valid");
    }

    if (!data.type) {
        errors.type = req.__("The type is required");
    } else if (data.type !== 'customer') {
        errors.type = req.__("Invalid type");
    }

    if (!data.otp_type) {
        errors.otp_type = req.__("The OTP type is required");
    } else if (data.otp_type !== 'login' && data.otp_type !== 'register') {
        errors.otp_type = req.__("Invalid OTP type");
    }

    return errors;
};

module.exports = {
    userRegisterValidatorFields,
    userUpdateValidatorFields,
    changePasswordValidatorFields,
    sendOtpValidatorFields,
};

