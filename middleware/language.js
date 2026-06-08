const i18n = require("i18n");

module.exports = (req, res) => {
    const { locale } = req.params; // Set language cookie if valid
    if (i18n.getLocales().includes(locale)) {
        console.log("Language change request for locale:", locale);
        res.cookie("lang", locale, { maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days
        res.setLocale(locale);
    } // Redirect to previous page or fallback

    const referer = req.get("Referer");
    const fallbackRedirect = "/"; // Prevent infinite loop if referrer contains /lang/

    const isValidRedirect = referer && !referer.includes("/lang/");

    return res.redirect(isValidRedirect ? referer : fallbackRedirect);
};
