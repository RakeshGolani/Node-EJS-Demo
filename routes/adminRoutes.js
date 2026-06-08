const express = require('express');
const router = express.Router();
const dashboardController = require('../controller/admin/dashboardController');
const authController = require('../controller/admin/authController');
const adminController = require('../controller/admin/adminController');
const userController = require('../controller/admin/user/userController');

const cmsController = require('../controller/admin/cms/cmsController');
const faqController = require('../controller/admin/faq/faqController');
const contactUsController = require('../controller/admin/contactUs/contactUsController');
const appSettingController = require('../controller/admin/appSetting/appSettingController');
const commonController = require('../controller/admin/commonController');
const { ensureAuthenticated, redirectIfLoggedIn, verifyToken } = require('../middleware/authMiddleware');
// const { loginValidationRules } = require('../middleware/validators');
const { loginValidator, loginValidateRequest } = require('../utils/admin/loginValidator');
const upload = require('../utils/multer');
const i18n = require("i18n");
const languageMiddleware = require('../middleware/language');
const { loginRateLimiter } = require('../middleware/rateLimiter');

router.get('/language/:locale', languageMiddleware);


/* Auth Routes */
router.get('/login', redirectIfLoggedIn, authController.login);
router.post('/login', redirectIfLoggedIn, loginRateLimiter, loginValidator, loginValidateRequest, authController.loginPost);
router.post('/forgot-password', redirectIfLoggedIn, authController.forgotPassword);
router.get('/reset-password', redirectIfLoggedIn, authController.showResetPasswordForm);
router.post('/reset-password', redirectIfLoggedIn, authController.resetPassword);

router.get('/logout', authController.logout);

/* Dashboard Routes */
router.get('/dashboard', ensureAuthenticated, dashboardController.index);

/* Admin Routes */
router.get('/profile', ensureAuthenticated, adminController.profile);
router.post('/profile', ensureAuthenticated, upload.fields([{ name: 'profile_image', maxCount: 1 }]), adminController.updateProfile);
router.get('/verify-email-change/:token', ensureAuthenticated, adminController.changeEmailVerify);
router.post('/change-password', ensureAuthenticated, adminController.changePassword);

/* User Management Routes */
router.get('/users', ensureAuthenticated, userController.index);
router.get('/users/get-data', ensureAuthenticated, userController.getData);
router.post('/user/store', ensureAuthenticated, upload.fields([{ name: 'profile_image', maxCount: 1 }]), userController.storeUser);
router.get('/user/:id', ensureAuthenticated, userController.getUser);
router.post('/user/update/:id', ensureAuthenticated, upload.fields([{ name: 'profile_image', maxCount: 1 }]), userController.updateUser);
router.post('/user/change-status/:id', ensureAuthenticated, userController.changeStatus);
router.delete('/user/delete/:id', ensureAuthenticated, userController.deleteUser);



/* Cms Routes */
router.get('/cms', ensureAuthenticated, cmsController.index);
router.get('/cms/get-data', ensureAuthenticated, cmsController.getData);
router.get('/cms/get-details/:id', ensureAuthenticated, cmsController.getDetails);
router.post('/cms/update/:id', ensureAuthenticated, upload.none(), cmsController.updateCms);
router.get('/cms/get-details-view/:id', ensureAuthenticated, cmsController.getDetailsView);

/* FAQ Routes */
router.get('/faqs', ensureAuthenticated, faqController.index);
/* router.get('/faqs/get-data', ensureAuthenticated, faqController.getData); */
router.post('/faq/store', ensureAuthenticated, upload.none(), faqController.storeFaq);
router.get('/faq/:id', ensureAuthenticated, faqController.getFaq);
router.post('/faq/update/:id', ensureAuthenticated, upload.none(), faqController.updateFaq);
/* router.get('/faq/get-details/:id', ensureAuthenticated, can('Faq View'), faqController.getFaqDetails); */

/* Contact Us Routes */
router.get('/contact-us', ensureAuthenticated, contactUsController.index);
router.get('/contact-us/get-data', ensureAuthenticated, contactUsController.getData);
router.post('/contact-us/reply/:id', ensureAuthenticated, upload.none(), contactUsController.storeReply);

/* App Setting Routes */
router.get('/app-settings', ensureAuthenticated, appSettingController.index);
router.post('/app-settings/update', ensureAuthenticated, appSettingController.updateAppSetting);

/* Common Operation Routes */
router.get('/change-status', ensureAuthenticated, commonController.changeStatus);
router.get('/delete-record', ensureAuthenticated, commonController.deleteRecord);


module.exports = router;
