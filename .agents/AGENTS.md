# Node-EJS-Demo Project Rules

## 1. Structure & Architecture
- **Controllers**: Keep business logic out of routes. Handle requests and responses in the `controller/` directory.
- **Models**: Use the `models/` directory for database schemas and queries.
- **Views**: All EJS templates should reside in the `views/` directory. Keep logic in views to a minimum.
- **Routes**: Define application routes in the `routes/` directory. Group related routes together.

## 2. Views & EJS
- Use partials (e.g., header, footer, sidebar) for reusable UI components to keep EJS files DRY.
- Keep inline JavaScript in EJS minimal; prefer linking to external scripts in the `public/` folder.

## 3. Error Handling
- Use try-catch blocks in async controller methods.
- Pass errors to a centralized error-handling middleware.

## 4. Environment Variables
- Never hardcode sensitive credentials (DB passwords, API keys). Always use `process.env` and define them in the `.env` file.

## 5. Coding Standards
- Use modern JavaScript features (ES6+).
- Use `async/await` instead of raw Promises or callbacks to prevent callback hell.

## 6. Authentication & Sessions
- **Web/Admin Auth**: Use session-based authentication (`req.session.admin`) for web routes. Secure routes using the `ensureAuthenticated` middleware.
- **API Auth**: Use Bearer Tokens for APIs. Secure API routes using the `verifyToken` middleware which sets `req.user`.

## 7. Localization
- Use `req.__()` or `res.__()` for returning translated strings/messages from the middleware/controllers to ensure multi-language support.

## 8. Validations
- **Backend Validation**: Use `express-validator` (e.g., via `middleware/validators.js`) for server-side validation rules.
- **Frontend Display**: Pass validation errors to the EJS view and render them directly below the inputs using `<% if (errors && errors.field) { ... } %>`.

## 9. UI Components & Forms
- **Add/Edit Forms**: Use Bootstrap Offcanvas (`offcanvas offcanvas-end`) components within the `index.ejs` file for Add and Edit forms. Do not create separate `create.ejs` or `edit.ejs` pages.
- **Form Validation (Client-Side)**: Use the frontend FormValidation plugin for validating form inputs before submission.
- **Form Submission (AJAX)**: Offcanvas forms must always be submitted via AJAX. The page must not refresh on submit. The backend should return a JSON response, which the JS uses to show messages and update the UI.

## 10. Emails
- **Email Utility**: Always use the `sendEmail` (or `sendEmailJobsQue` for background tasks) function from `utils/admin/sendEmail.js` to send emails via `nodemailer`.
- **Templates**: Email templates must be EJS files (typically placed in `views/admin/emails/`) and they will automatically use the `"admin/layouts/emails"` layout.
- **Example Usage**: `await sendEmail(res, 'admin/emails/template-name', userName, userEmail, emailData, subject);`
