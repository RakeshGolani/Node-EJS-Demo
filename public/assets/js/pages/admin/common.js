$(document).ready( async function () {
    await window.i18nReady;

    const inputMobileField = document.querySelector(".mobile_field");
        if (typeof inputMobileField !== "undefined" && inputMobileField !== null) {
            window.iti = window.intlTelInput(inputMobileField, {
                initialCountry: "in",
                strictMode: true,
                formatOnDisplay: false,
                loadUtilsOnInit: '/admin/assets/vendor/js/intl-tel-input/utils.js',
                autoPlaceholder: "aggressive",
            });
            inputMobileField.addEventListener("countrychange", function() {
                inputMobileField.value = "";
            });
        }
        const inputMobileField2 = document.querySelector(".mobile_field2");
        if (typeof inputMobileField2 !== "undefined" && inputMobileField2 !== null) {
            window.iti2 = window.intlTelInput(inputMobileField2, {
                initialCountry: "in",
                strictMode: true,
                formatOnDisplay: false,
                loadUtilsOnInit: '/admin/assets/vendor/js/intl-tel-input/utils.js',
                autoPlaceholder: "aggressive",
            });
            inputMobileField2.addEventListener("countrychange", function() {
                inputMobileField2.value = "";
            });
        }

    }).on("click", ".notification-close", function () {
        $(".notification-" + $(this).attr("data-count")).slideUp(700, function () { $(this).remove(); });
    }).on("change blur keyup keydown", ".password_trim", function () {
        var current_val = $(this).val();
        $(this).val(current_val.trim());
    }).on("change blur keyup keydown", ".min_2_char", function () {
        var current_val = $(this).val();
        if (current_val.length < 2) { $(this).val(current_val.substring(0, 2)); }
    }).on("change blur keyup keydown", ".max_3_digit", function () {
        var current_val = $(this).val();
        if (current_val.length > 3) { $(this).val(current_val.substring(0, 3)); }
    }).on("change blur keyup keydown", ".max_5_char", function () {
        var current_val = $(this).val();
        if (current_val.length > 5) { $(this).val(current_val.substring(0, 5)); }
    }).on("change blur keyup keydown", ".max_6_char", function () {
        var current_val = $(this).val();
        if (current_val.length > 6) { $(this).val(current_val.substring(0, 6)); }
    }).on("change blur keyup keydown", ".max_10_char", function () {
        var current_val = $(this).val();
        if (current_val.length > 10) { $(this).val(current_val.substring(0, 10)); }
    }).on("change blur keyup keydown", ".max_25_char", function () {
        var current_val = $(this).val();
        if (current_val.length > 25) { $(this).val(current_val.substring(0, 25)); }
    }).on("change blur keyup keydown", ".max_70_char", function () {
        var current_val = $(this).val();
        if (current_val.length > 70) { $(this).val(current_val.substring(0, 70)); }
    }).on("change blur keyup keydown", ".max_100_char", function () {
        var current_val = $(this).val();
        if (current_val.length > 100) { $(this).val(current_val.substring(0, 100)); }
    }).on("change blur keyup keydown", ".max_200_char", function () {
        var current_val = $(this).val();
        if (current_val.length > 200) { $(this).val(current_val.substring(0, 200)); }
    }).on("change blur keyup keydown", ".max_255_char", function () {
        var current_val = $(this).val();
        if (current_val.length > 255) { $(this).val(current_val.substring(0, 255)); }
    }).on("change blur keyup keydown", ".max_2000_char", function () {
        var current_val = $(this).val();
        if (current_val.length > 2000) { $(this).val(current_val.substring(0, 2000)); }
    }).on("change blur keyup keydown", ".left_space_remove", function () {
        var current_val = $(this).val();
        $(this).val(current_val.replace(/^\s+/, ""));
    }).on("change blur keyup keydown", ".amount_allow_4_digit_dot", function () {
        var current_val = $(this).val();
        if (current_val.length > 4) { $(this).val(current_val.substring(0, 4)); }
    }).on("change blur keyup keydown", ".amount_allow_10_digit_dot", function () {
        var current_val = $(this).val();
        if (current_val.length > 10) { $(this).val(current_val.substring(0, 10)); }
    }).on("cut copy paste", ".restrict_cut_copy_paste", function (e) {
        e.preventDefault();
    }).on("keypress", ".only_amount", function (event) {
        var key = window.event ? event.keyCode : event.which;
        if (key == 8 || key == 46 || key == 37 || key == 39) {
            return true;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    }).on("keypress", ".only_number", function (event) {
        var key = window.event ? event.keyCode : event.which;
        if (key == 8 || key == 37 || key == 39) {
            return true;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    }).on("keypress", ".only_number_with_plus", function (event) {
        var key = window.event ? event.keyCode : event.which;
        if (key == 8 || key == 37 || key == 39 || key == 43) {
            return true;
        } else if (key < 48 || key > 57) {
            return false;
        } else return true;
    }).on("keypress", ".only_name", function (event) {
        if (/^[a-zA-ZÀ-ÖØ-öø-ÿ\u0600-\u06FF]+$/.test(event.key)) {
            return true;
        } else return false;
    }).on("keypress", ".only_full_name", function (event) {
        if (/^[a-zA-ZÀ-ÖØ-öø-ÿ\u0600-\u06FF\s]+$/.test(event.key)) {
            return true;
        } else return false;
    }).on("keypress", ".only_char_and_number", function (event) {
        if (/^[a-zA-ZÀ-ÖØ-öø-ÿ0-9\u0600-\u06FF]+$/.test(event.key)) {
            return true;
        } else return false;
    }).on("keypress", ".only_full_name_and_number", function (event) {
        if (/^[a-zA-ZÀ-ÖØ-öø-ÿ0-9\u0600-\u06FF\s]+$/.test(event.key)) {
            return true;
        } else return false;
    }).on("keypress", ".only_upper_letters_numbers_only", function (event) {
        if (/^[A-Z0-9]+$/.test(event.key)) {
            return true;
        } else return false;
    });
function changeStatus(model, id, status) {
        $.ajax({
        url: `/admin/change-status?model=${model}&id=${id}&status=${status}`,
        type: "GET",
        success: function (res) {
            if (res.success) {
                Notiflix.Notify.success(res.message, {
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
}

async function deleteRecord(model, id, table_id) {
    await window.i18nReady;

    Notiflix.Confirm.show(
        i18n.t('Confirm Deletion'),
        i18n.t('Are you sure you want to delete this record?'),
        i18n.t('Yes, Delete it!'),
        i18n.t('Cancel'),
        function okCallback() {
            $.ajax({
                url: `/admin/delete-record?model=${model}&id=${id}`,
                type: "GET",
                success: function (res) {
                    if (res.success) {
                        Notiflix.Notify.success(res.message, {
                            clickToClose: true
                        });
                    } else {
                        Notiflix.Notify.failure(res.message, {
                        });
                    }
                    // Optionally, you can refresh the DataTable
                    if (table_id) {
                        $("#" + table_id).DataTable().ajax.reload(null, false);
                    } else {
                        location.reload();
                    }
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
}

// Initialize the Google Maps Places Autocomplete
function initAutocomplete(input, latitude, longitude) {
    const addressInput = document.getElementById(input);
    if (!addressInput) return;

    const autocomplete = new google.maps.places.Autocomplete(addressInput, {
        types: ['geocode'],
        /* componentRestrictions: { country: 'sa' } */
    });

    autocomplete.addListener('place_changed', function () {
        const place = autocomplete.getPlace();
        if (place.geometry) {
            document.getElementById(latitude).value = place.geometry.location.lat();
            document.getElementById(longitude).value = place.geometry.location.lng();
        }
    });
}
