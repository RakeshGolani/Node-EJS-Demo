const { body, validationResult } = require("express-validator");
const { Admin } = require("../../models");

const loginValidator = [
  body("email")
    .custom(async (value) => {
      const user = await Admin.findOne({ where: { email: value } });
      if (!user) throw new Error("Email not registered");
    })
    .isEmail()
    .withMessage("Invalid email format")
    .notEmpty()
    .withMessage("Email is required"),

  body("password")
    .custom(async (value, { req }) => {
      const user = await Admin.findOne({ where: { email: req.body.email } });
      if (user && !(await user.validatePassword(value))) {
        throw new Error("Invalid password");
      }
    })
    .notEmpty()
    .withMessage("Password is required"),
];
const loginValidateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const mappedErrors = {};
    errors.array().forEach((err) => {
      mappedErrors[err.path] = err.msg;
    });
    req.flash("errors", mappedErrors);
    req.flash("old", req.body);
    return res.status(422).redirect("/admin/login");
  }

  next();
};

module.exports = { loginValidator, loginValidateRequest };
