// let tableTitle = document.createElement("h5");
// tableTitle.classList.add(
//   "card-title",
//   "mb-0",
//   "text-md-start",
//   "text-center",
//   "pb-md-0",
//   "pb-6"
// );
const myOffcanvasAdd = document.getElementById("add-new-record");
const myOffcanvasUpdate = document.getElementById("update-record");
document.addEventListener("DOMContentLoaded", async function () {
    await window.i18nReady;
    
    //tableTitle.innerHTML = i18n.t("FAQ's List");

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

    

    //     buttonsArray.push({
    //         text: `
    //             <span class="d-flex align-items-center gap-2" data-bs-toggle="offcanvas" data-bs-target="#add-new-record">
    //                 <i class="icon-base ti tabler-plus icon-sm"></i> 
    //                 <span class="d-none d-md-inline">${i18n.t("Add FAQ")}</span>
    //             </span>
    //         `,
    //         className: "create-new btn btn-outline-primary px-2 px-md-3", // Padding for small and large screens
    //         init: function (api, node, config) {
    //             $(node).removeClass("btn-secondary");
    //         }
    //     });

    $("#faqs-datatable").DataTable({
        processing: true,
        serverSide: true,
        scrollX: true,
        ajax: "/admin/faqs/get-data",
        columns: [
            {
                data: "id",
            },
            {
                data: "role",
            },
            {
                data: "question",
            },
            {
                data: "status",
            },
            {
                data: "createdAt",
            },
            {
                data: "id",
            },
        ],
        columnDefs: [
            {
                targets: 0,
                visible: false, // Hide ID column
                searchable: false,
            },
            {
                targets: 1,
                render: function (data) {
                    return capitalizeFirst(data);
                }
            },
            {
                targets: 2,
                render: function (data) {
                    return `<span class="d-block">${data || ''}</span>`;
                },
            },
            {
                targets: 3,
                render: function (data, type, full, meta) {
                    const checked = data == "active" ? "checked" : "";
                    const statusSwitch = `
                        <div class="demo-vertical-spacing">
                            <label class="switch">
                                <input type="checkbox" onclick="changeStatus('Faq', ${full.id})" class="switch-input" ${checked} />
                                <span class="switch-toggle-slider">
                                    <span class="switch-on"></span> 
                                    <span class="switch-off"></span>
                                </span>
                            </label>
                        </div>
                    `;
                    return statusSwitch;
                }
            },
            {
                targets: 4,
                render: function (data) {
                    return `<span class="d-block">${data || ''}</span>`;
                },
            },
            {
                targets: 5,
                className: "text-center text-nowrap",
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    let buttons = '<div class="d-inline-flex align-items-center gap-1">';
                    buttons += `
                        <button class="btn btn-sm btn-outline-primary" data-id="${row.id}" data-url="/admin/faq/update/${row.id}" data-bs-toggle="offcanvas" data-bs-target="#update-record" title="Edit">
                        <i class="fa-regular fa-pen-to-square"></i>
                        </button>`;

                    buttons += `
                        <a href="/admin/faq/get-details/${row.id}" class="btn btn-sm btn-outline-info" data-id="${row.id}" title="View">
                        <i class="fa-solid fa-info"></i>
                        </a>`;
                        
                    buttons += `
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteRecord('Faq', ${row.id}, 'faqs-datatable')" title="Delete">
                        <i class="fa-regular fa-trash-can"></i>
                        </button>`;
                        
                    buttons += '</div>';
                    return buttons;   
                },
            },
        ],
        order: [[0, "desc"]],
        layout: {
            topStart: {
                rowClass: "row mx-0 px-3 my-0 justify-content-between border-bottom",
                features: [
                    {
                        pageLength: {
                            menu: [10, 25, 50, 100],
                            text: "Show_MENU_entries",
                        },
                    },
                ],
            },
            topEnd: {
                search: {
                    placeholder: "",
                },
            },
            bottomStart: {
                rowClass: "row mx-3 justify-content-between",
                features: ["info"],
            },
            bottomEnd: "paging",
        },
        language: {
            paginate: {
                next: '<i class="icon-base ti tabler-chevron-right scaleX-n1-rtl icon-18px"></i>',
                previous: '<i class="icon-base ti tabler-chevron-left scaleX-n1-rtl icon-18px"></i>',
                first: '<i class="icon-base ti tabler-chevrons-left scaleX-n1-rtl icon-18px"></i>',
                last: '<i class="icon-base ti tabler-chevrons-right scaleX-n1-rtl icon-18px"></i>',
            },
        },
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
                }
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
                        $('#faqs-datatable').DataTable().ajax.reload();
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
                fvFormAddFaq.resetForm(); // Reset form validation states
                formAddFaq.reset(); // Reset form fields
                $("#role").val(null).trigger('change'); // Reset select2 field
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
                }
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
                        $('#faqs-datatable').DataTable().ajax.reload();
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
                fvFormUpdateFaq.resetForm(); // Reset form validation states
                formUpdateFaq.reset(); // Reset the form fields
                $("#formUpdateFaq").attr('action', ''); // Reset form action URL
                $("#edit_role").val(null).trigger('change'); // Reset select2 field
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