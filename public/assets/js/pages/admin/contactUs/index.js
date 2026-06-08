document.addEventListener("DOMContentLoaded", async function () {
    await window.i18nReady;

    const buttonsArray = [
        buttons = [],
    ];

    $("#contact-us-datatable").DataTable({
        processing: true,
        serverSide: true,
        responsive: true,
        ajax: "/admin/contact-us/get-data",
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
                data: "email",
            },
            {
                data: "phone",
            },
            {
                data: "is_replied",
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
                render: function (data) {
                    return capitalizeFirst(data);
                }
            },
            {
                targets: 3,
                render: function (data) {
                    return `<span class="d-block">${data}</span>`;
                },
            },
            {
                targets: 4,
                render: function (data) {
                    return data ? `<span class="d-block">${data}</span>` : '-';
                },
            },
            {
                targets: 5,
                render: function (data, type, row) {
                    if (data) {
                        return '<span class="badge bg-label-success">' + i18next.t('Replied') + '</span>';
                    } else {
                        return '<span class="badge bg-label-warning">' + i18next.t('Pending') + '</span>';
                    }
                },
            },
            {
				targets: 6,
				render: function (data) {
					return `<span class="d-block">${data}</span>`;
				},
			},
            {
                targets: 7,
                className: "text-center",
                // orderable: false,
                render: function (data, type, row) {
                    let buttons = '';
                    buttons += `
                        <button class="btn btn-sm btn-outline-primary me-1" data-id="${row.id}" onclick="openReplyModal(${JSON.stringify(row).replace(/"/g, '&quot;')})" title="Reply" data-bs-toggle="modal" data-bs-target="#replyModal">
                        <i class="icon-base ti tabler-mail-forward"></i>
                        </button>`;

                    buttons += `
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteRecord('ContactUs', ${row.id}, 'contact-us-datatable')" title="Delete">
                        <i class="icon-base ti tabler-trash"></i>
                        </button>`;    
                    return buttons;   
                },
            },
        ],
        order: [[0, "desc"]],
        // ... (rest of the config remains same)
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
                display: $.fn.dataTable.Responsive.display.modal({
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

    function capitalizeFirst(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Initializing FormValidation for Reply Form
    const replyForm = document.getElementById('replyForm');
    const fvReply = FormValidation.formValidation(replyForm, {
        fields: {
            reply: {
                validators: {
                    notEmpty: {
                        message: i18next.t('Reply message is required')
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
                eleValidClass: "",
                rowSelector: ".form-control-validation",
            }),
            submitButton: new FormValidation.plugins.SubmitButton(),
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

    // Handle Form Validation Success
    fvReply.on('core.form.valid', function() {
        const id = $(replyForm).data('id');
        const serializedData = $(replyForm).serialize();

        Notiflix.Loading.circle();

        $.ajax({
            url: `/admin/contact-us/reply/${id}`,
            type: 'POST',
            data: serializedData,
            success: function (response) {
                Notiflix.Loading.remove();
                if (response.status === true) {
                    $('#replyModal').modal('hide');
                    $('#contact-us-datatable').DataTable().ajax.reload();
                    Notiflix.Notify.success(response.message);
                } else {
                    Notiflix.Notify.failure(response.message);
                }
            },
            error: function (xhr) {
                Notiflix.Loading.remove();
                if (xhr.status === 422) {
                    Object.entries(xhr.responseJSON.errors).forEach(([field, message]) => {
                        fvReply.updateValidatorOption(field, 'server', 'message', message);
                        fvReply.updateFieldStatus(field, 'Invalid', 'server');
                    });
                } else {
                    const response = xhr.responseJSON;
                    const message = response?.message || 'Something went wrong';
                    Notiflix.Notify.failure(message);
                }
            }
        });
    });

    // Open Reply Modal
    window.openReplyModal = function (data) {
        $("#replyId").val(data.id);
        $("#replyForm").data("id", data.id); // Set the ID on the form for validation handler
        $("#userName").val(data.name);
        $("#userEmail").val(data.email);
        $("#userPhone").val(data.phone || '-');
        $("#userMessage").val(data.message);
        $("#replyMessage").val(data.reply || '');
        
        // Reset validation state when opening
        fvReply.resetForm();
        
        $("#replyModal").modal("show");
    };

    // Reset form when modal is hidden
    $('#replyModal').on('hidden.bs.modal', function () {
        fvReply.resetForm();
    });
});