document.addEventListener("DOMContentLoaded", async function () {
    await window.i18nReady;

    

    $("#contact-us-datatable").DataTable({
        processing: true,
        serverSide: true,
        scrollX: true,
        ajax: "/admin/contact-us/get-data",
        columns: [
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
                render: function (data) {
                    return data ? `<span class="d-block">${data}</span>` : '-';
                },
            },
            {
                targets: 4,
                orderable: false,
                render: function (data, type, row) {
                    if (data) {
                        return '<span class="badge bg-label-success">' + i18next.t('Replied') + '</span>';
                    } else {
                        return '<span class="badge bg-label-warning">' + i18next.t('Pending') + '</span>';
                    }
                },
            },
            {
                targets: 5,
                render: function (data) {
                    return `<span class="d-block">${data || ''}</span>`;
                },
            },
            {
                targets: 6,
                className: "text-center text-nowrap",
                orderable: false,
                searchable: false,
                render: function (data, type, row) {
                    let buttons = '<div class="d-inline-flex align-items-center gap-1">';
                    buttons += `
                        <button class="btn btn-sm btn-outline-primary" data-id="${row.id}" onclick="openReplyModal(${JSON.stringify(row).replace(/"/g, '&quot;')})" title="Reply" data-bs-toggle="modal" data-bs-target="#replyModal">
                        <i class="icon-base ti tabler-mail-forward"></i>
                        </button>`;

                    buttons += `
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteRecord('ContactUs', '${row.id}', 'contact-us-datatable')" title="Delete">
                        <i class="icon-base ti tabler-trash"></i>
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

    function capitalizeFirst(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

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
