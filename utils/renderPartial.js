const ejs = require('ejs');
const path = require('path');
const i18n = require('i18n'); // Ensure you import your i18n config

module.exports = async function renderPartial(view, data = {}) {
    const viewPath = path.join(__dirname, '../views/', `${view}.ejs`);

    // Attach translation function if not already present
    if (!data.__) {
        data.__ = i18n.__;
    }

    return new Promise((resolve, reject) => {
        ejs.renderFile(viewPath, data, {}, (err, str) => {
            if (err) return reject(err);
            resolve(str);
        });
    });
};
