document.addEventListener("DOMContentLoaded", async function () {
    await window.i18nReady;
    // Update/reset user image of profile page
    let accountUserImage = document.getElementById('uploadedAvatar');
    const fileInput = document.querySelector('.profile-file-input'),
    resetFileInput = document.querySelector('.profile-image-reset');

    if (accountUserImage) {
        const resetImage = accountUserImage.src;
        fileInput.onchange = () => {
            if (fileInput.files[0]) {
                accountUserImage.src = window.URL.createObjectURL(fileInput.files[0]);
            }
        };
        resetFileInput.onclick = () => {
            fileInput.value = '';
            accountUserImage.src = resetImage;
        };
    }

    // Set initial phone number for flag detection
    if (window.iti && document.querySelector('#phone')) {
        const phoneVal = document.querySelector('#phone').getAttribute('value');
        if (phoneVal) {
            window.iti.setNumber(phoneVal);
        }
    }

    // Enable/disable email input based on checkbox
	$("#emailChange").change(function() {
		if (this.checked) {
			$("#email").prop("readonly", false);
		} else {
			$("#email").prop("readonly", true);
		}
	});

    const formAccSettings = document.querySelector('#formProfileUpdate');
    // Form validation for Update Profile
    if (formAccSettings) {
        const fvUpdateProfile = FormValidation.formValidation(formAccSettings, {
            fields: {
                name: {
                    validators: {
                        notEmpty: {
                            message: i18n.t('The name is required')
                        },
                        stringLength: {
                            min:2,
                            max: 50,
                            message: i18n.t('Please enter a name containing 2 to 50 characters.')
                        },
                        regexp: {
                            regexp: /^[a-zA-ZÀ-ÖØ-öø-ÿ\u0600-\u06FF\s]+$/,
                            message: i18n.t('Name must contain only letters and spaces')
                        },
                        server: {
                            message: ''
                        }
                    }
                },
                email: {
                    validators: {
                        notEmpty: {
                            message: i18n.t('Email address is required')
                        },
                        emailAddress: {
                            message: i18n.t('The value is not a valid email address')
                        },
                        server: {
                            enabled: function () {
                                return document.getElementById('emailChange').checked; // only check server if changing
                            },
                            message: i18n.t('Email already exists for another user'),
                        }
                    }
                },
                phone: {
                    validators: {
                        notEmpty: {
                            message: i18n.t('Phone number is required')
                        },
                        callback: {
                            message: i18n.t('The phone number is not valid'),
                            callback: function (input) {
                                if (input.value === '') {
                                    return true;
                                }
                                return window.iti ? window.iti.isValidNumber() : true;
                            }
                        },
                        server: {
                            message: ''
                        }
                    }
                },
                // phone: {
                //     validators: {
                //         notEmpty: {
                //             message: i18n.t('The phone number is required')
                //         },
                //         digits: {
                //             message: i18n.t('The value is not valid phone number')
                //         },
                //         stringLength: {
                //             min: 10,
                //             max: 12,
                //             message: i18n.t("The phone number must be between 10 and 12 digits long"),
                //         },
                //         server: {
                //             message: ''
                //         }
                //     }
                // },
                profile_image: {
                    validators: {
                        file: {
                            extension: "jpeg,jpg,png,gif",
                            type: "image/jpeg,image/jpg,image/png,image/gif",
                            maxSize: 2097152, // 2 MB
                            message: i18n.t("The selected file is not valid. Allowed formats: jpeg, jpg, png, gif and max size 2 MB"),
                        },
                    },
                },
                },
                plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap5: new FormValidation.plugins.Bootstrap5({
                    eleValidClass: '',
                    rowSelector: '.form-control-validation'
                }),
                submitButton: new FormValidation.plugins.SubmitButton(),
                // Submit the form when all fields are valid
                //defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
                autoFocus: new FormValidation.plugins.AutoFocus()
                },
                init: instance => {
                instance.on('plugins.message.placed', function (e) {
                    if (e.element.parentElement.classList.contains('input-group')) {
                    e.element.parentElement.insertAdjacentElement('afterend', e.messageElement);
                    }
                });
            }
        });

        fvUpdateProfile.on('core.form.valid', function (event) {
            Notiflix.Block.hourglass('#formProfileUpdate');
            if (window.iti) {
                document.querySelector('#phone').value = window.iti.getNumber();
            }
            event.formValidation.form.submit();
        });
    }

    const formChangePass = document.querySelector('#formChangePassword');
    // Form validation for Change Password
    if (formChangePass) {
        const fvChangePassword = FormValidation.formValidation(formChangePass, {
            fields: {
                currentPassword: {
                    validators: {
                        notEmpty: {
                            message: i18n.t('Current password is required')
                        },
                        stringLength: {
                            min: 8,
                            max: 20,
                            message: i18n.t("The password must be between 8 and 20 characters long"),
                            minMessage: i18n.t("The password must be at least 8 characters long"),
                            maxMessage: i18n.t("The password must be at most 20 characters long"),
                        },
                        server: {
                            message: ''
                        }
                    }
                },
                newPassword: {
                    validators: {
                        notEmpty: {
                            message: i18n.t('New password is required')
                        },
                        stringLength: {
                            min: 8,
                            max: 20,
                            message: i18n.t("The password must be between 8 and 20 characters long"),
                            minMessage: i18n.t("The password must be at least 8 characters long"),
                            maxMessage: i18n.t("The password must be at most 20 characters long"),
                        },
                        server: {
                            message: ''
                        }
                    }
                },
                confirmPassword: {
                    validators: {
                        // notEmpty: {
                        //     message: i18n.t('Confirm new password is required')
                        // },
                        identical: {
                            compare: function () {
                                return formChangePass.querySelector('[name="newPassword"]').value;
                            },
                            message: i18n.t('The new password and its confirm password are not the same')
                        },
                        server: {
                            message: ''
                        }
                    }
                }
            },
            plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap5: new FormValidation.plugins.Bootstrap5({
                eleValidClass: '',
                rowSelector: '.form-control-validation'
            }),
            submitButton: new FormValidation.plugins.SubmitButton(),
            // Submit the form when all fields are valid
            //defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
            autoFocus: new FormValidation.plugins.AutoFocus()
            },
            init: instance => {
                instance.on('plugins.message.placed', function (e) {
                    if (e.element.parentElement.classList.contains('input-group')) {
                    e.element.parentElement.insertAdjacentElement('afterend', e.messageElement);
                    }
                });
            }
        });

        fvChangePassword.on('core.form.valid', function (event) {
            Notiflix.Block.hourglass('#formChangePassword');
            event.formValidation.form.submit();
        });
    }
});

