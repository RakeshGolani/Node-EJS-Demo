const myOffcanvasAdd = document.getElementById("add-new-record");
const myOffcanvasUpdate = document.getElementById("update-record");
document.addEventListener("DOMContentLoaded", async function () {
    await window.i18nReady;

    $(function () {
    // Init custom option check
    window.Helpers.initCustomOptionCheck();

    // Select2 Role
    var select2 = $('.select2');
    if (select2.length) {
        select2.each(function () {
            var $this = $(this);
            $this.wrap('<div class="position-relative"></div>').select2({
                    placeholder: i18n.t("Select Role"),
                    dropdownParent: $this.parent()
                });
            });
        }
    });

    const formAddFaq = document.getElementById("formAddFaq");
        if (formAddFaq) {
        const fvFormAddFaq = FormValidation.formValidation(formAddFaq, {
            fields: {
                role: {
                    validators: {
                        notEmpty: {
                            message: i18n.t("The role is required"),
                        },
                        server: {
                            message: ''
                        },
                    },
                },
                question: {
                    validators: {
                        notEmpty: {
                            message: i18n.t("The question is required"),
                        },
                        stringLength: {
							min: 2,
							message: i18n.t('The question must be more than 2 characters long')
						},
                        server: {
                            message: ''
                        },
                    },
                },
                answer: {
                    validators: {
                        notEmpty: {
                            message: i18n.t("The answer is required"),
                        },
                        server: {
                            message: ''
                        },
                    },
                },
                /* question_ar: {
                    validators: {
                        notEmpty: {
                            message: i18n.t("The question Arabic is required"),
                        },
                        server: {
                            message: ''
                        },
                    },
                },
                answer_ar: {
                    validators: {
                        notEmpty: {
                            message: i18n.t("The answer Arabic is required"),
                        },
                        server: {
                            message: ''
                        },
                    },
                }, */
            },
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap5: new FormValidation.plugins.Bootstrap5({
                // Use this for enabling/changing valid/invalid class
                // eleInvalidClass: '',
                eleValidClass: "",
                rowSelector: ".form-control-validation",
                }),
                submitButton: new FormValidation.plugins.SubmitButton(),
                //defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
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
        fvFormAddFaq.on("core.form.valid", function (event) {
            Notiflix.Block.hourglass('#add-new-record');

            let form = document.getElementById('formAddFaq');
            let url = form.getAttribute('action');
            let formData = new FormData(form);

            $.ajax({
                type: 'POST',
                url: url,
                data: formData,
                processData: false,
                contentType: false,
                dataType: 'json',
                success: function (response) {
                    if (response.status === 200 || response.status === true) {
                        $("#add-new-record").offcanvas('hide');
                        form.reset();
                        Notiflix.Notify.success(response.message, {
                            clickToClose: true,
                        });
                        window.location.reload();
                    } else {
                        Notiflix.Notify.failure(response.message, {
                            clickToClose: true,
                        });
                    }
                },
                error: function (xhr, status, error) {
                    if (xhr.status === 422) {
                        //console.log('Status:',xhr.responseJSON.errors);
                        Object.entries(xhr.responseJSON.errors).forEach(([field, message]) => {
                            fvFormAddFaq.updateValidatorOption(field, 'server', 'message', message);
                            fvFormAddFaq.updateFieldStatus(field, 'Invalid', 'server');
                        });
                    } else {
                        const response = xhr.responseJSON;
                        const message = response?.message || 'An unexpected error occurred.';
                        Notiflix.Notify.failure(message, {
                            clickToClose: true,
                        });
                    }
                },
                complete: function () {
                    Notiflix.Block.remove('#add-new-record');
                }
            });
        });

        if (myOffcanvasAdd) {
            myOffcanvasAdd.addEventListener("hidden.bs.offcanvas", function () {
                fvFormAddFaq.resetForm(); // Reset form validation
                formAddFaq.reset(); // Reset form fields
                $("#role").val(null).trigger('change'); // Reset the select2 field
            });

            myOffcanvasAdd.addEventListener("show.bs.offcanvas", async function (e) {
                
            });
        }
    }

    const formUpdateFaq = document.getElementById("formUpdateFaq");
        if (formUpdateFaq) {
        const fvFormUpdateFaq = FormValidation.formValidation(formUpdateFaq, {
            fields: {
                role: {
                    validators: {
                        notEmpty: {
                            message: i18n.t("The role is required"),
                        },
                        server: {
                            message: ''
                        },
                    },
                },
                question: {
                    validators: {
                        notEmpty: {
                            message: i18n.t("The question is required"),
                        },
                        stringLength: {
							min: 2,
							message: i18n.t('The question must be more than 2 characters long')
						},
                        server: {
                            message: ''
                        },
                    },
                },
                answer: {
                    validators: {
                        notEmpty: {
                            message: i18n.t("The answer is required"),
                        },
                        server: {
                            message: ''
                        },
                    },
                },
                /* question_ar: {
                    validators: {
                        notEmpty: {
                            message: i18n.t("The question Arabic is required"),
                        },
                        server: {
                            message: ''
                        },
                    },
                },
                answer_ar: {
                    validators: {
                        notEmpty: {
                            message: i18n.t("The answer Arabic is required"),
                        },
                        server: {
                            message: ''
                        },
                    },
                }, */
            },
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap5: new FormValidation.plugins.Bootstrap5({
                // Use this for enabling/changing valid/invalid class
                // eleInvalidClass: '',
                eleValidClass: "",
                rowSelector: ".form-control-validation",
                }),
                submitButton: new FormValidation.plugins.SubmitButton(),
                //defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
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
        fvFormUpdateFaq.on("core.form.valid", function (event) {
            Notiflix.Block.hourglass('#update-record');

            let form = document.getElementById('formUpdateFaq');
            let url = form.getAttribute('action');
            let formData = new FormData(form);

            $.ajax({
                type: 'POST',
                url: url,
                data: formData,
                processData: false,
                contentType: false,
                dataType: 'json',
                success: function (response) {
                    if (response.status === 200 || response.status === true) {
                        $("#update-record").offcanvas('hide');
                        form.reset();
                        Notiflix.Notify.success(response.message, {
                            clickToClose: true,
                        });
                        window.location.reload();
                    } else {
                        Notiflix.Notify.failure(response.message, {
                            clickToClose: true,
                        });
                    }
                },
                error: function (xhr, status, error) {
                    if (xhr.status === 422) {
                        //console.log('Status:',xhr.responseJSON.errors);
                        Object.entries(xhr.responseJSON.errors).forEach(([field, message]) => {
                            fvFormUpdateFaq.updateValidatorOption(field, 'server', 'message', message);
                            fvFormUpdateFaq.updateFieldStatus(field, 'Invalid', 'server');
                        });
                    } else {
                        const response = xhr.responseJSON;
                        const message = response?.message || 'An unexpected error occurred.';
                        Notiflix.Notify.failure(message, {
                            clickToClose: true,
                        });
                    }
                },
                complete: function () {
                    Notiflix.Block.remove('#update-record');
                }
            });
        });

        if (myOffcanvasUpdate) {
            myOffcanvasUpdate.addEventListener("hidden.bs.offcanvas", function () {
                fvFormUpdateFaq.resetForm(); // Reset form validation
                formUpdateFaq.reset(); // Reset form fields
                $("#formUpdateFaq").removeAttr('action'); // Remove action attribute from form
                $("#edit_role").val(null).trigger('change'); // Reset the select2 field
            });

            myOffcanvasUpdate.addEventListener("show.bs.offcanvas", async function (e) {
                let faqId = e.relatedTarget.getAttribute("data-id");
                let updateUrl = e.relatedTarget.getAttribute("data-url");
                let faqData = await getFaqData(faqId);
                $("#formUpdateFaq").attr("action", updateUrl);
            });
        }
    }

    $(document).on('click', '#add_new', function () {
        $('#add-new-record').offcanvas('show'); // Show the offcanvas 
    });
    
});

function getFaqData(faqId) {
    $.ajax({
        url: `/admin/faq/${faqId}`,
        type: "GET",
        dataType: "json",
        success: function (response) {
            if (response.status === true) {
                const data = response.data;
                $('#edit_role').val(data.role).trigger('change'); // Set the selected roles 
                $("#edit_question").val(data.question);
                $("#edit_answer").val(data.answer);
                $("#edit_question_ar").val(data.question_ar);
                $("#edit_answer_ar").val(data.answer_ar);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching user data:", error);
            return null;
        }
    });
}

function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}