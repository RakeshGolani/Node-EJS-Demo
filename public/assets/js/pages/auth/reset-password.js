document.addEventListener("DOMContentLoaded", async function () {
    await window.i18nReady;
        const formRestPassword = document.querySelector("#formRestPassword");
        // Form validation for Reset Password
        if (formRestPassword) {
            const fv = FormValidation.formValidation(formRestPassword, {
                fields: {
                password: {
                    validators: {
                    notEmpty: {
                        message: i18n.t("The new password is required"),
                    },
                    stringLength: {
                        min: 8,
                        max: 20,
                        message: i18n.t("The password must be between 8 and 20 characters long"),
                        minMessage: i18n.t("The password must be at least 8 characters long"),
                        maxMessage: i18n.t("The password must be at most 20 characters long"),
                    }
                    }
                },
                confirmPassword: {
                    validators: {
                    notEmpty: {
                        message: i18n.t('Confirm new password is required')
                    },
                    identical: {
                        compare: function () {
                        return formRestPassword.querySelector('[name="password"]').value;
                        },
                        message: i18n.t('The new password and its confirm password are not the same')
                    },
                    // stringLength: {
                    //   min: 8,
                    //   message: 'Password must be more than 8 characters'
                    // }
                    }
                }
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
                Notiflix.Block.hourglass('#formRestPassword');
                event.formValidation.form.submit();
            });
        }
    });