document.addEventListener('DOMContentLoaded', async function (e) {
    await window.i18nReady;
  (function () {
    // add role form validation
    const fvAddRoleForm = FormValidation.formValidation(document.getElementById('addRoleForm'), {
        fields: {
            'name': {
            validators: {
                notEmpty: {
                    message: i18n.t('Please enter a role name.'),
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
            'name_ar': {
            validators: {
                notEmpty: {
                    message: i18n.t('Please enter a role name ar.'),
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
                }
            }
            },
            "permissions[]": {
            validators: {
                notEmpty: {
                    message: i18n.t('Please select one or more permissions.'),
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
            // Use this for enabling/changing valid/invalid class
            // eleInvalidClass: '',
            eleValidClass: '',
            rowSelector: '.form-control-validation'
            }),
            submitButton: new FormValidation.plugins.SubmitButton(),
            // Submit the form when all fields are valid
            //defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
            autoFocus: new FormValidation.plugins.AutoFocus()
        }
    });

    fvAddRoleForm.on('core.form.valid', function (event) {
        Notiflix.Block.hourglass('#addRoleForm');

        let form = document.getElementById('addRoleForm');
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
                    $('#roles_list_data').append(response.htmlData);
                    $('#addRoleModal').modal('hide');
                    form.reset();
                    Notiflix.Notify.success(response.message, {
                        clickToClose: true,
                    });
                } else { 
                    Notiflix.Notify.failure(response.message, {
                        clickToClose: true,
                    });
                }
            },
            error: function (xhr, status, error) {
                if (xhr.status === 422) {
                    Object.entries(xhr.responseJSON.errors).forEach(([field, message]) => {
                        fvAddRoleForm.updateValidatorOption(field, 'server', 'message', message);
                        fvAddRoleForm.updateFieldStatus(field, 'Invalid', 'server');
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
                Notiflix.Block.remove('#addRoleModal');
            }
        });
    });

    // edit role form validation
    const fvEditRoleForm = FormValidation.formValidation(document.getElementById('editRoleForm'), {
        fields: {
            'name': {
            validators: {
                notEmpty: {
                    message: i18n.t('Please enter a role name.'),
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
            'name_ar': {
            validators: {
                notEmpty: {
                    message: i18n.t('Please enter a role name ar.'),
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
                }
            }
            },
            "permissions[]": {
            validators: {
                notEmpty: {
                    message: i18n.t('Please select one or more permissions.'),
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
            // Use this for enabling/changing valid/invalid class
            // eleInvalidClass: '',
            eleValidClass: '',
            rowSelector: '.form-control-validation'
            }),
            submitButton: new FormValidation.plugins.SubmitButton(),
            // Submit the form when all fields are valid
            //defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
            autoFocus: new FormValidation.plugins.AutoFocus()
        }
    });

    fvEditRoleForm.on('core.form.valid', function (event) {
        Notiflix.Block.hourglass('#editRoleForm');

        let form = document.getElementById('editRoleForm');
        ///let url = form.getAttribute('action');
        let editFormData = new FormData(form);

        $.ajax({
            type: 'POST',
            url: $(form).attr('action'),
            data: editFormData,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function (response) {
                if (response.status === 200 || response.status === true) {
                    $('#roles_list_data').find('#replace_role_card_' + response.role_id).replaceWith(response.htmlData);
                    //console.log('Role ID:',response.role_id);
                    $('#editRoleModal').modal('hide');
                    form.reset();
                    Notiflix.Notify.success(response.message, {
                        clickToClose: true,
                    });
                } else {
                    Notiflix.Notify.failure(response.message, {
                        clickToClose: true,
                    });
                }
            },
            error: function (xhr, status, error) {
                if (xhr.status === 422) {
                    Object.entries(xhr.responseJSON.errors).forEach(([field, message]) => {
                        fvEditRoleForm.updateValidatorOption(field, 'server', 'message', message);
                        fvEditRoleForm.updateFieldStatus(field, 'Invalid', 'server');
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
                Notiflix.Block.remove('#editRoleModal');
            }
        });
    });

    $('#addRoleModal, #editRoleModal').on('hidden.bs.modal', function () {
        fvAddRoleForm.resetForm(); // Reset form validation states
        fvEditRoleForm.resetForm(); // Reset form validation states
        $("#addRoleForm, #editRoleForm").attr('action', ''); // Reset form action URL
        $(this).find('form')[0].reset(); // Reset form fields
        $(this).find('input[type="checkbox"]').prop('checked', false).trigger('change'); // Uncheck all checkboxes
    });

    $('#editRoleModal').on('shown.bs.modal', function (e) {
        const name = $(e.relatedTarget).data('name');
        const name_ar = $(e.relatedTarget).data('name-ar');
        const editUrl = $(e.relatedTarget).data('edit-url');
        const permissions = $(e.relatedTarget).data('permissions');
        
        let permissionsArray = [];
        if (Array.isArray(permissions)) {
            permissionsArray = permissions;
        } else if (typeof permissions === 'string') {
            permissionsArray = permissions.split(',');
        } else if (typeof permissions === 'number') {
            permissionsArray = [permissions]; // wrap single number into array
        }
        $.each(permissionsArray, function (index, value) {
            $('#perm_edit_' + value).prop('checked', true).trigger('change');
        });

        $('#editRoleForm').attr('action', editUrl);
        $('#editRoleForm #name').val(name);
        $('#editRoleForm #name_ar').val(name_ar);
    });
    
    // Select All checkbox click
    const selectAll = document.querySelector('#selectAll'),
        checkboxList = document.querySelectorAll('[type="checkbox"]');
        selectAll.addEventListener('change', t => {
            checkboxList.forEach(e => {
                e.checked = t.target.checked;
            });
        });

    // Select All Edit checkbox click
    const selectAllEdit = document.querySelector('#selectAllEdit'),
        checkboxListEdit = document.querySelectorAll('[type="checkbox"]');
        selectAllEdit.addEventListener('change', t => {
            checkboxListEdit.forEach(e => {
                e.checked = t.target.checked;
            });
        });
    
    })();
});