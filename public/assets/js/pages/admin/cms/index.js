document.addEventListener("DOMContentLoaded", async function () {
    await window.i18nReady;

    const buttonsArray = [
        buttons = [],
    ];

    $("#cms-datatable").DataTable({
        processing: true,
        serverSide: true,
        responsive: true,
        ajax: "/admin/cms/get-data",
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
                data: "panel",
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
                targets: 2,
                render: function (data, type, full, meta) {
                    const name = full['name'];
                    const name_ar = full['name_ar'];

                    const rowOutput = `
                    <div class="d-flex justify-content-start align-items-center user-name">
                        <div class="d-flex flex-column">
                            <span class="emp_name text-truncate text-heading fw-medium">${name}</span>
                            <small class="emp_email text-truncate">${name_ar}</small>
                        </div>
                    </div>
                    `;

                    return rowOutput;
                }
            },
            {
                targets: 3,
                render: function (data) {
                    return capitalizeFirst(data);
                }
            },
            {
				targets: 4,
				render: function (data) {
					return `<span class="d-block">${data}</span>`;
				},
			},
            {
                targets: 5,
                className: "text-center",
                orderable: false,
                render: function (data, type, row) {
                    let buttons = '';
                    buttons += `
                        <button type="button" class="btn btn-sm btn-outline-primary me-1" data-id="${row.id}" data-url="/admin/cms/get-details/${row.id}" data-update-url="/admin/cms/update/${row.id}" data-bs-toggle="modal" data-bs-target="#editCmsModal" title="Edit">
                        <i class="fa-regular fa-pen-to-square"></i>
                        </button>`;
                    buttons += `
                        <a href="/admin/cms/get-details-view/${row.id}" class="btn btn-sm btn-outline-info me-1" data-id="${row.id}" title="View">
                        <i class="fa-solid fa-info"></i>
                        </a>`;
                    return buttons;
                },
            },
        ],
        order: [[0, "desc"]],
        layout: {
        top2End: {
            features: [
                {
                    buttons: buttonsArray,
                },
            ],
        },
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

    const editCmsForm = document.getElementById("editCmsForm");
        if (editCmsForm) {
        const fvEditCmsForm = FormValidation.formValidation(editCmsForm, {
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
                name_ar: {
                    validators: {
                        notEmpty: {
                            message: i18n.t("The name ar is required"),
                        },
                        stringLength: {
                            min:2,
                            max: 50,
                            message: i18n.t('Please enter a name containing 2 to 50 characters.')
                        },
                        regexp: {
                            regexp: /^[a-zA-ZÀ-ÖØ-öø-ÿ\u0600-\u06FF\s]+$/,
                            message: i18n.t('Name ar must contain only letters and spaces')
                        },
                        server: {
                            message: ''
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
        fvEditCmsForm.on("core.form.valid", function (event) {
            Notiflix.Block.hourglass('#editCmsModal');

            let form = document.getElementById('editCmsForm');
            let url = form.getAttribute('action');
            let formData = new FormData(form);
            formData.append('content', contentEditor.root.innerHTML);
            formData.append('content_ar', contentEditorAr.root.innerHTML);
            $.ajax({
                type: 'POST',
                url: url,
                data: formData,
                processData: false,
                contentType: false,
                dataType: 'json',
                success: function (response) {
                    if (response.status === 200 || response.status === true) {
                        $('#editCmsModal').modal('hide');
                        form.reset();
                        Notiflix.Notify.success(response.message, {
                            clickToClose: true,
                        });
                        $('#cms-datatable').DataTable().ajax.reload();
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
                            fvEditCmsForm.updateValidatorOption(field, 'server', 'message', message);
                            fvEditCmsForm.updateFieldStatus(field, 'Invalid', 'server');
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
                    Notiflix.Block.remove('#editCmsModal');
                }
            });
        });

        $('#editCmsModal').on('hidden.bs.modal', function (e) {
            fvEditCmsForm.resetForm(); // Reset form validation states
            editCmsForm.reset(); // Reset form fields
            $("#editCmsForm").attr('action', ''); // Reset form action URL
            contentEditor.root.innerHTML = ''; // Clear Quill editor content
            contentEditorAr.root.innerHTML = ''; // Clear Quill editor content
        });

        $('#editCmsModal').on('show.bs.modal', function (e) {
            const button = e.relatedTarget;
            const id = button.getAttribute('data-id');
            const url = button.getAttribute('data-url');
            const updateUrl = button.getAttribute('data-update-url');
            $.ajax({
                type: 'GET',
                url: url,
                data: { id: id },
                dataType: 'json',
                success: function (response) {
                    if (response.status === 200 || response.status === true) {
                        const data = response.data;
                        $("#editCmsForm input[type=text]").each(function(key, value) {
                            $(this).val(data[value.id]);
                        });
                        contentEditor.root.innerHTML = data.content;
                        contentEditorAr.root.innerHTML = data.content_ar;
                        $('#editCmsForm').attr('action', updateUrl);
                    }
                },
                error: function (xhr, status, error) {
                    console.error("Error fetching user data:", error);
                    return null;
                }
            });
        });
    }

    const fullToolbar = [
        [
            {
                font: []
            },
            {
                size: []
            }
        ],
        ['bold', 'italic', 'underline', 'strike'],
        [
            {
                color: []
            },
            {
                background: []
            }
        ],
        [
            {
                script: 'super'
            },
            {
                script: 'sub'
            }
        ],
        [
            {
                header: '1'
            },
            {
                header: '2'
            },
            'blockquote',
            'code-block'
        ],
        [
            {
                list: 'ordered'
            },
            {
                indent: '-1'
            },
            {
                indent: '+1'
            }
        ],
        [{ direction: 'rtl' }, { align: [] }],
        ['link', 'image', 'video', 'formula'],
        ['clean']
    ];
    const contentEditor = new Quill('#contentEditor', {
        bounds: '#contentEditor',
        placeholder: 'Type Something...',
        modules: {
            syntax: true,
            toolbar: fullToolbar
        },
        theme: 'snow'
    });

    const contentEditorAr = new Quill('#contentArEditor', {
        bounds: '#contentArEditor',
        placeholder: 'Type Something...',
        modules: {
            syntax: true,
            toolbar: fullToolbar
        },
        theme: 'snow'
    });

    function capitalizeFirst(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});