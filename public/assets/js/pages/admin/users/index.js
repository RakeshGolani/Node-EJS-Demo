const myOffcanvasAdd = document.getElementById("add-new-record");
const myOffcanvasUpdate = document.getElementById("update-record");
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

    let updateAccountUserImage = document.getElementById('editUploadedAvatar');
    const updateFileInput = document.querySelector('.edit-profile-file-input');
    const updateResetFileInput = document.querySelector('.edit-profile-image-reset');

        if (updateAccountUserImage) {
        const resetImage = updateAccountUserImage.src;
        updateFileInput.onchange = () => {
            if (updateFileInput.files[0]) {
            updateAccountUserImage.src = window.URL.createObjectURL(updateFileInput.files[0]);
            }
        };
        updateResetFileInput.onclick = () => {
            updateFileInput.value = '';
            updateAccountUserImage.src = resetImage;
        };
    }

    const buttonsArray = [
        buttons = [],
    ];

    buttonsArray.push({
        extend: "collection",
        className: "btn btn-label-primary dropdown-toggle",
        // className: "btn btn-label-primary dropdown-toggle me-4",
        text: '<span class="d-flex align-items-center gap-2"><i class="icon-base ti tabler-upload icon-xs me-sm-1"></i> <span class="d-none d-sm-inline-block">'+ i18n.t("Export") +'</span></span>',
        init: function (api, node, config) {
            $(node).removeClass("btn-secondary");
        },
        buttons: [
        {
            extend: "print",
            text: `<span class="d-flex align-items-center"><i class="icon-base ti tabler-printer me-1"></i>Print</span>`,
            className: "dropdown-item",
            exportOptions: {
            columns: [1, 2, 4, 5],
            format: {
                body: function (inner, coldex, rowdex) {
                    if (inner == null || inner.length <= 0) return '';

                    const innerStr = String(inner);

                    if (innerStr.indexOf("<") > -1) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(innerStr, "text/html");

                        let text = "";

                        const userNameElements = doc.querySelectorAll(".user-name");
                        if (userNameElements.length > 0) {
                        userNameElements.forEach((el) => {
                            const nameText =
                            el.querySelector(".fw-medium")?.textContent ||
                            el.querySelector(".d-block")?.textContent ||
                            el.textContent;
                            text += nameText.trim() + " ";
                        });
                        } else {
                        text = doc.body.textContent || doc.body.innerText;
                        }

                        return text.trim();
                    }

                    return innerStr.trim();
                    },
                },
            },
            customize: function (win) {
            win.document.body.style.color =
                config.colors.headingColor;
            win.document.body.style.borderColor =
                config.colors.borderColor;
            win.document.body.style.backgroundColor =
                config.colors.bodyBg;
            const table = win.document.body.querySelector("table");
            table.classList.add("compact");
            table.style.color = "inherit";
            table.style.borderColor = "inherit";
            table.style.backgroundColor = "inherit";
            },
        },
        {
            extend: "csv",
            text: `<span class="d-flex align-items-center"><i class="icon-base ti tabler-file-text me-1"></i>Csv</span>`,
            className: "dropdown-item",
            exportOptions: {
            columns: [1, 2, 4, 5],
            format: {
                body: function (inner, coldex, rowdex) {
                if (inner.length <= 0) return inner;

                // Parse HTML content
                const parser = new DOMParser();
                const doc = parser.parseFromString(
                    inner,
                    "text/html"
                );

                let text = "";

                // Handle user-name elements specifically
                const userNameElements =
                    doc.querySelectorAll(".user-name");
                if (userNameElements.length > 0) {
                    userNameElements.forEach((el) => {
                    // Get text from nested structure - try different selectors
                    const nameText =
                        el.querySelector(".fw-medium")?.textContent ||
                        el.querySelector(".d-block")?.textContent ||
                        el.textContent;
                    text += nameText.trim() + " ";
                    });
                } else {
                    // Handle other elements (status, role, etc)
                    text = doc.body.textContent || doc.body.innerText;
                }

                return text.trim();
                },
            },
            },
        },
        {
            extend: "excel",
            text: `<span class="d-flex align-items-center"><i class="icon-base ti tabler-file-spreadsheet me-1"></i>Excel</span>`,
            className: "dropdown-item",
            exportOptions: {
            columns: [1, 2, 4, 5],
            format: {
                body: function (inner, coldex, rowdex) {
                if (inner.length <= 0) return inner;

                // Parse HTML content
                const parser = new DOMParser();
                const doc = parser.parseFromString(
                    inner,
                    "text/html"
                );

                let text = "";

                // Handle user-name elements specifically
                const userNameElements =
                    doc.querySelectorAll(".user-name");
                if (userNameElements.length > 0) {
                    userNameElements.forEach((el) => {
                    // Get text from nested structure - try different selectors
                    const nameText =
                        el.querySelector(".fw-medium")?.textContent ||
                        el.querySelector(".d-block")?.textContent ||
                        el.textContent;
                    text += nameText.trim() + " ";
                    });
                } else {
                    // Handle other elements (status, role, etc)
                    text = doc.body.textContent || doc.body.innerText;
                }

                return text.trim();
                },
            },
            },
        },
        {
            extend: "pdf",
            text: `<span class="d-flex align-items-center"><i class="icon-base ti tabler-file-description me-1"></i>Pdf</span>`,
            className: "dropdown-item",
            exportOptions: {
            columns: [1, 2, 4, 5],
            format: {
                body: function (inner, coldex, rowdex) {
                if (inner.length <= 0) return inner;

                // Parse HTML content
                const parser = new DOMParser();
                const doc = parser.parseFromString(
                    inner,
                    "text/html"
                );

                let text = "";

                // Handle user-name elements specifically
                const userNameElements =
                    doc.querySelectorAll(".user-name");
                if (userNameElements.length > 0) {
                    userNameElements.forEach((el) => {
                    // Get text from nested structure - try different selectors
                    const nameText =
                        el.querySelector(".fw-medium")?.textContent ||
                        el.querySelector(".d-block")?.textContent ||
                        el.textContent;
                    text += nameText.trim() + " ";
                    });
                } else {
                    // Handle other elements (status, role, etc)
                    text = doc.body.textContent || doc.body.innerText;
                }

                return text.trim();
                },
            },
            },
        },
        {
            extend: "copy",
            text: `<i class="icon-base ti tabler-copy me-1"></i>Copy`,
            className: "dropdown-item",
            exportOptions: {
            columns: [1, 2, 4, 5],
            format: {
                body: function (inner, coldex, rowdex) {
                if (inner.length <= 0) return inner;

                // Parse HTML content
                const parser = new DOMParser();
                const doc = parser.parseFromString(
                    inner,
                    "text/html"
                );

                let text = "";

                // Handle user-name elements specifically
                const userNameElements =
                    doc.querySelectorAll(".user-name");
                if (userNameElements.length > 0) {
                    userNameElements.forEach((el) => {
                    // Get text from nested structure - try different selectors
                    const nameText =
                        el.querySelector(".fw-medium")?.textContent ||
                        el.querySelector(".d-block")?.textContent ||
                        el.textContent;
                    text += nameText.trim() + " ";
                    });
                } else {
                    // Handle other elements (status, role, etc)
                    text = doc.body.textContent || doc.body.innerText;
                }

                return text.trim();
                },
            },
            },
        },
        ],
    });

    $("#user-datatable").DataTable({
        processing: true,
        serverSide: true,
        responsive: true,
        ajax: "/admin/users/get-data",
        columns: [
            {
                data:"id",
            },
            {
                data: "id",
            },
            {
                data: "name",
            },
            {
                data: "status",
            },
            {
                data: "phone",
            },
            {
                data: "createdAt",
            },
        ],
        columnDefs: [
            {
                // For Responsive
                className: 'control',
                orderable: false,
                searchable: false,
                responsivePriority: 2,
                targets: 0,
                render: function (data, type, full, meta) {
                    return '';
                }
            },
            {
                targets: 1,
                visible: false, // Hide ID column
                searchable: false,
            },
            {
            // Avatar image/badge, Name and email
                targets: 2,
                render: function (data, type, full, meta) {
                    const userImg = full['profile_image'] ? full['profile_image'] : null;
                    const name = full['name'];
                    const email = full['email'];
                    let output;

                    if (userImg) {
                    // For Avatar image
                    output = `<img src="${userImg}" alt="Avatar" class="rounded-circle">`;
                    } else {
                    // For Avatar badge
                    const stateNum = Math.floor(Math.random() * 6);
                    const states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary'];
                    const state = states[stateNum];
                    let initials = name.match(/\b\w/g) || [];
                    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
                    output = `<span class="avatar-initial rounded-circle bg-label-${state}">${initials}</span>`;
                    }

                    // Creates full output for row
                    const rowOutput = `
                    <div class="d-flex justify-content-start align-items-center user-name">
                        <div class="avatar-wrapper">
                        <div class="avatar me-2">
                            ${output}
                        </div>
                        </div>
                        <div class="d-flex flex-column">
                        <span class="emp_name text-truncate text-heading fw-medium">${name}</span>
                        <small class="emp_email text-truncate">${email}</small>
                        </div>
                    </div>
                    `;

                    return rowOutput;
                }
            },
            // {
            //     targets: 1,
            //     render: function (data, type, row) {
            //         return `
            //             <div class="d-flex align-items-center user-name">
            //                 <img src="${row.profile_image ? row.profile_image : "assets/img/avatars/default.png"}" alt="Avatar" class="rounded-circle me-2 dt-profile-image" width="40" height="40">
            //                 <span class="fw-medium d-block">${data}</span>
            //             </div>
            //         `;
            //     },
            // },
            {
                targets: 3,
                render: function (data, type, full, meta) {
                    const checked = data === "active" ? "checked" : "";
                    let statusSwitch = '';
                    
                    statusSwitch = `
                            <div class="">
                                <label class="switch">
                                    <input type="checkbox" id="change-status" data-id="${full.id}" data-url="/admin/user/change-status/${full.id}" class="switch-input" ${checked} />
                                    <span class="switch-toggle-slider">
                                        <span class="switch-on"></span> 
                                        <span class="switch-off"></span>
                                    </span>
                                </label>
                            </div>
                        `;

                    return statusSwitch;
                },
            },

            {
                targets: 4,
                render: function (data) {
                    return `<span class="d-block">${data}</span>`;
                },
            },
            {
				targets: 5,
				render: function (data) {
					return `<span class="d-block">${data}</span>`;
				},
			},
            {
                targets: 6,
                className: "text-center",
                // orderable: false,
                render: function (data, type, row) {
                    let buttons = '';
                    buttons += `
                        <button class="btn btn-sm btn-outline-primary me-1" data-id="${row.id}" data-url="/admin/user/update/${row.id}" data-bs-toggle="offcanvas" data-bs-target="#update-record" title="Edit">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>`;
                    buttons += `
                        <button class="btn btn-sm btn-outline-danger" id="delete-record" data-id="${row.id}" data-url="/admin/user/delete/${row.id}" title="Delete">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>`;
                    
                    return buttons;
                }
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
            features: [
                {
                    search: {
                        placeholder: "",
                    },
                },
                {
                    buttons: buttonsArray,
                }
            ],
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
            previous:
            '<i class="icon-base ti tabler-chevron-left scaleX-n1-rtl icon-18px"></i>',
            first:
            '<i class="icon-base ti tabler-chevrons-left scaleX-n1-rtl icon-18px"></i>',
            last: '<i class="icon-base ti tabler-chevrons-right scaleX-n1-rtl icon-18px"></i>',
        },
        },
        responsive: {
            details: {
                display: DataTable.Responsive.display.modal({
                header: function (row) {
                    const data = row.data();
                    return "Details of " + data["name"];
                },
                }),
                type: "column",
                renderer: function (api, rowIdx, columns) {
                const data = columns
                    .map(function (col) {
                    return col.title !== "" // Do not show row in modal popup if title is blank (for check box)
                        ? `<tr data-dt-row="${col.rowIndex}" data-dt-column="${col.columnIndex}">
                                <td>${col.title}:</td>
                                <td>${col.data}</td>
                                </tr>`
                        : "";
                    })
                    .join("");

                if (data) {
                    const div = document.createElement("div");
                    div.classList.add("table-responsive");
                    const table = document.createElement("table");
                    div.appendChild(table);
                    table.classList.add("table");
                    table.classList.add("datatables-basic");
                    const tbody = document.createElement("tbody");
                    tbody.innerHTML = data;
                    table.appendChild(tbody);
                    return div;
                }
                return false;
                },
            },
        },
    });

    const formAddNewRecord = document.getElementById("formAddNewRecord");
        if (formAddNewRecord) {
        const fvAddUser = FormValidation.formValidation(formAddNewRecord, {
            fields: {
                name: {
                    validators: {
                        notEmpty: {
                            message: i18n.t("The name is required"),
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
                        },
                    },
                },
                email: {
                    validators: {
                        notEmpty: {
                            message: i18n.t("The email is required"),
                        },
                        emailAddress: {
                            message: i18n.t("The email is not valid"),
                        },
                        server: {
                            message: ''
                        },
                    },
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
                address: {
                    validators: {
                        notEmpty: {
                            message: i18n.t("The address is required"),
                        },
                        server: {
                            message: ''
                        },
                    },
                },
                password: {
                    validators: {
                        notEmpty: {
                            message: i18n.t("The password is required"),
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
                        },
                    },
                },
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
        fvAddUser.on("core.form.valid", function (event) {
            Notiflix.Block.hourglass('#add-new-record');
            
            let form = document.getElementById('formAddNewRecord');
            let url = form.getAttribute('action');
            let formData = new FormData(form);
            if (window.iti) {
                formData.set('phone', window.iti.getNumber());
            }

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
                        $('#user-datatable').DataTable().ajax.reload();
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
                            fvAddUser.updateValidatorOption(field, 'server', 'message', message);
                            fvAddUser.updateFieldStatus(field, 'Invalid', 'server');
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
                fvAddUser.resetForm(); // Reset form validation states
                formAddNewRecord.reset(); // Reset form fields
            });
            
            myOffcanvasAdd.addEventListener("show.bs.offcanvas", async function (e) {
                const offcanvasId = e.target.id;
                if (offcanvasId === 'add-new-record') {
                    initAutocomplete('address', 'latitude', 'longitude');
                }

                $("#uploadedAvatar").attr("src", "/admin/assets/img/avatars/default.png");
            });
        }
    }

    const formUpdateRecord = document.getElementById("formUpdateRecord");
        if (formUpdateRecord) {
            const fvUpdateUser = FormValidation.formValidation(formUpdateRecord, {
            fields: {
                name: {
                    validators: {
                        notEmpty: {
                            message: i18n.t("The name is required"),
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
                        },
                    },
                },
                email: {
                    validators: {
                        notEmpty: {
                            message: i18n.t("The email is required"),
                        },
                        emailAddress: {
                            message: i18n.t("The email is invalid"),
                        },
                        server: {
                            message: ''
                        },
                    },
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
                                return window.iti2 ? window.iti2.isValidNumber() : true;
                            }
                        },
                        server: {
                            message: ''
                        }
                    }
                },
                address: {
                    validators: {
                        notEmpty: {
                            message: i18n.t("The address is required"),
                        },
                        server: {
                            message: ''
                        },
                    },
                },
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
        fvUpdateUser.on("core.form.valid", function (event) {
            Notiflix.Block.hourglass('#update-record');
            
            let form = document.getElementById('formUpdateRecord');
            let url = form.getAttribute('action');
            let formData = new FormData(form);
            if (window.iti2) {
                formData.set('phone', window.iti2.getNumber());
            }

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
                        $('#user-datatable').DataTable().ajax.reload();
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
                            fvUpdateUser.updateValidatorOption(field, 'server', 'message', message);
                            fvUpdateUser.updateFieldStatus(field, 'Invalid', 'server');
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
                fvUpdateUser.resetForm(); // Reset form validation states
                formUpdateRecord.reset(); // Reset the form fields
                $("#formUpdateRecord").attr("action", ""); // Clear form action URL
            });
            myOffcanvasUpdate.addEventListener("show.bs.offcanvas", async function (e) {
                const userId = $(e.relatedTarget).data("id");
                const url = $(e.relatedTarget).data("url");
                const offcanvasId = e.target.id;

                if (offcanvasId === 'update-record') {
                    initAutocomplete('editAddress', 'edit_latitude', 'edit_longitude');
                }

                $("#formUpdateRecord").attr("action", url);
                //console.log("Update URL:", url);
                await getUserData(userId);
                $("#editPassword").val("");
            });
        }
    }

    $(document).on('click', '#add_new', function () {
        $('#add-new-record').offcanvas('show'); // Show the offcanvas
    });

    $(document).on("click", "#delete-record", function (e) {
        e.preventDefault();
        const userId = $(this).data("id");
        const url = $(this).data("url");

        Notiflix.Confirm.show(
            i18n.t('Confirm Deletion'),
            i18n.t('Are you sure you want to delete this record?'),
            i18n.t('Yes, Delete it!'),
            i18n.t('Cancel'),
            function okCallback() {
                $.ajax({
                    url: url,
                    type: "DELETE",
                    success: function (res) {
                        if (res.success) {
                            $(`#user-${userId}`).remove();
                            Notiflix.Notify.success(res.message, {
                                //timeout: 1500,
                                clickToClose: true
                            });
                        } else {
                            Notiflix.Notify.failure(res.message, {
                            });
                        }
                        // Optionally, you can refresh the DataTable
                        $("#user-datatable").DataTable().ajax.reload(null, false);
                    },
                    error: function (xhr, status, error) {
                        console.error("Error deleting user:", error);
                        Notiflix.Notify.failure(xhr.responseJSON.message, {
                            clickToClose: true
                        });
                    }
                });
            },
            function cancelCallback() {
                // User cancelled; optional notify
                Notiflix.Notify.info('Delete action cancelled', {
                    clickToClose: true
                });
            }
        );
    });

    $(document).on("click", "#change-status", function () {
        const userId = $(this).data("id");
        const url = $(this).data("url");
        const status = $(this).is(":checked") ? "active" : "inactive";

        $.ajax({
            url: url,
            type: "POST",
            data: { status: status },
            success: function (res) {
                if (res.success) {
                    Notiflix.Notify.success(res.message + ` ${status}`, {
                        clickToClose: true
                    });
                } else {
                    Notiflix.Notify.failure(res.message, {
                        clickToClose: true
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error("Error updating user status:", error);
                Notiflix.Notify.failure(xhr.responseJSON.message, {
                    clickToClose: true
                });
            }
        });
    });
});

function getUserData(userId) {
    $.ajax({
        url: `/admin/user/${userId}`,
        type: "GET",
        dataType: "json",
        success: function (data) {
            $("#editName").val(data.name);
            $("#editEmail").val(data.email);
            if (window.iti2) {
                window.iti2.setNumber(data.phone);
            } else {
                $("#editPhone").val(data.phone);
            }
            $("#editAddress").val(data.address);
            $("#edit_latitude").val(data.latitude);
            $("#edit_longitude").val(data.longitude);
            $("#editUploadedAvatar").attr("src", data.profile_image || "/admin/assets/img/avatars/default.png");
        },
        error: function (xhr, status, error) {
            console.error("Error fetching user data:", error);
            return null;
        }
    });
}

// function deleteRecord(element) {
//     const userId = $(element).data("id");
//     const url = $(element).data("url");

//     Notiflix.Confirm.show(
//         'Confirm Deletion',
//         'Are you sure you want to delete this user?',
//         'Yes, Delete it!',
//         'Cancel',
//         function okCallback() {
//             $.ajax({
//                 url: url,
//                 type: "DELETE",
//                 success: function (res) {
//                     if (res.success) {
//                         $(`#user-${userId}`).remove();
//                         Notiflix.Notify.success('User deleted successfully', {
//                             //timeout: 1500,
//                             clickToClose: true
//                         });
//                     } else {
//                         Notiflix.Notify.failure('Failed to delete user', {
//                         });
//                     }
//                     // Optionally, you can refresh the DataTable
//                     $("#user-datatable").DataTable().ajax.reload(null, false);
//                 },
//                 error: function (xhr, status, error) {
//                     console.error("Error deleting user:", error);
//                     Notiflix.Notify.failure('Failed to delete user', {
//                         clickToClose: true
//                     });
//                 }
//             });
//         },
//         function cancelCallback() {
//             // User cancelled; optional notify
//             Notiflix.Notify.info('Delete action cancelled', {
//                 clickToClose: true
//             });
//         }
//     );
// }


