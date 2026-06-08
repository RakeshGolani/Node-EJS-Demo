document.addEventListener("DOMContentLoaded", async function () {
    await window.i18nReady;

    const formLogin = document.querySelector("#formLoginAuthentication");
    // Form validation for Login
    if (formLogin) {
        const fv = FormValidation.formValidation(formLogin, {
            fields: {
            email: {
                validators: {
                    notEmpty: {
                        message: i18n.t("Please enter email address"),
                    },
                    emailAddress: {
                        message: i18n.t("The value is not a valid email address"),
                    },
                },
            },
            password: {
                validators: {
                    notEmpty: {
                        message: i18n.t("Please enter new password"),
                    },
                    stringLength: {
                        min: 8,
                        max: 20,
                        message: i18n.t("The password must be between 8 and 20 characters long"),
                        minMessage: i18n.t("The password must be at least 8 characters long"),
                        maxMessage: i18n.t("The password must be at most 20 characters long"),
                    },
                },
            },
            },
            plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap5: new FormValidation.plugins.Bootstrap5({
                eleValidClass: "",
                rowSelector: ".form-control-validation",
            }),
            submitButton: new FormValidation.plugins.SubmitButton(),
            // Submit the form when all fields are valid
            defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
            autoFocus: new FormValidation.plugins.AutoFocus(),
            },
            init: (instance) => {
                instance.on("plugins.message.placed", function (e) {
                    if (e.element.parentElement.classList.contains("input-group")) {
                    e.element.parentElement.insertAdjacentElement(
                        "afterend",
                        e.messageElement
                    );
                    }
                });
            },
        });
        fv.on("core.form.valid", function (event) {
            Notiflix.Block.hourglass('#formBlockId');
            event.formValidation.form.submit();
        });
    }

    const formSendEmail = document.querySelector("#formSendEmail");
    // Form validation for Send Email
    if (formSendEmail) {
        const fv = FormValidation.formValidation(formSendEmail, {
            fields: {
            email: {
                validators: {
                    notEmpty: {
                        message: i18n.t("Please enter email address"),
                    },
                    emailAddress: {
                        message: i18n.t("The value is not a valid email address"),
                    },
                },
            },
            },
            plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap5: new FormValidation.plugins.Bootstrap5({
                eleValidClass: "",
                rowSelector: ".form-control-validation",
            }),
            submitButton: new FormValidation.plugins.SubmitButton(),
            // Submit the form when all fields are valid
            defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
            autoFocus: new FormValidation.plugins.AutoFocus(),
            },
            init: (instance) => {
                instance.on("plugins.message.placed", function (e) {
                    if (e.element.parentElement.classList.contains("input-group")) {
                    e.element.parentElement.insertAdjacentElement(
                        "afterend",
                        e.messageElement
                    );
                    }
                });
            },
        });
        fv.on("core.form.valid", function (event) {
            Notiflix.Block.hourglass('#formBlockId');
            event.formValidation.form.submit();
        });
    }
});

function showHideContent(showContentId, hideContentId) {
  document.getElementById(showContentId).style.display = "block";
  document.getElementById(hideContentId).style.display = "none";
}
