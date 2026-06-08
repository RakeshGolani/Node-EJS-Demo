const nodemailer = require('nodemailer');
const ejs = require("ejs");
const path = require("path");

// Setup transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        service: "Gmail",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });

async function sendEmail(res, emailTemplate, userName, email, data, subject) {
    try {
         // Render email template
        const html = await new Promise((resolve, reject) => {
            res.render(emailTemplate,
                {
                    layout: "admin/layouts/emails",
                    userName,
                    email,
                    data,
                    //currentYear: new Date().getFullYear(),
                },
                (err, html) => (err ? reject(err) : resolve(html))
            );
        });

        await transporter.sendMail({
            to: email,
            from: process.env.SMTP_USER,
            subject,
            html,
        });
    } catch (mailErr) {
        console.error("Email send error:", mailErr);
        throw mailErr;
    }
}

async function sendEmailJobsQue(emailTemplate, userName, email, data, subject) {
    
    try {
        const templatePath = path.join(__dirname, "../../views", `${emailTemplate}.ejs`);

        // Render file
        const html = await ejs.renderFile(templatePath, {
            userName,
            email,
            data,
        });

        await transporter.sendMail({
            to: email,
            from: process.env.SMTP_FROM_EMAIL,
            subject,
            html,
        });

        console.log(`📧 Email sent to ${email}`);
    } catch (mailErr) {
        console.error("Email send error:", mailErr);
        throw mailErr;
    }
}

module.exports = {
    sendEmail,
    sendEmailJobsQue,
};