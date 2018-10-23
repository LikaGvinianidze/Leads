/*
  Role submit handler
*/

$("#form-validate").validate({
    rules: {
        name: {
            required: true,
            minlength: 2
        }
    },
    messages: {
        name: {
            required: "ეს ველი აუცილებელია!",
            minlength: jQuery.validator.format("შეიყვანეთ არა ნაკლებ {0} სიმბოლო.")
        }
    },
    invalidHandler: function(form, validator) {
        var errors = validator.numberOfInvalids();
        if (errors) {
              $("html, body").animate({ scrollTop: 0 }, "slow");
        }
    },
    submitHandler: function () {
        var form = $("#form-validate");

        $.ajax({
            type: 'POST',
            url: '/services/add',
            async: false,
            cache: false,
            data: form.serialize(),
            success: function (response) {
                window.location.href = '/services';
            },
            error: function (error) {
                console.log('error is', error);
                $('.alert-done').hide();
                $('.alert-error').show();
                $("html, body").animate({ scrollTop: 0 }, "slow");
            }
        });
    }
});

// On update
$("#form-update").validate({
    rules: {
        description: {
            required: false,
            minlength: 5
        },
        cost: {
            number: true
        },
        duration: {
            number: true
        },
        sex: {
            required: true
        }
    },
    messages: {
        description: {
            minlength: jQuery.validator.format("შეიყვანეთ არა ნაკლებ {0} სიმბოლო.")
        },
        cost: {
            number: 'შეიყვანეთ მხოლოდ ციფრები.'
        },
        duration: {
            number: 'შეიყვანეთ მხოლოდ ციფრები.'
        },
        sex: {
            required: 'აირჩიეთ მინიმუმ ერთი ველი.'
        }
    },
    submitHandler: function () {
        var form = $("#form-update");

        $.ajax({
            type: 'PUT',
            url: window.location.pathname,
            async: false,
            cache: false,
            data: form.serialize(),
            success: function (response) {
                location.reload();
                $('.alert-error').hide();
                $('.alert-done').show();
            },
            error: function (error) {
                console.log('error is', error);
                $('.alert-done').hide();
                $('.alert-error').show();
            }
        });
    }
});

// On Delete
$(document).ready(function () {
    $('.user-del').click(function () {
        $.ajax({
            url: '/services/' + $(this).attr('uid'),
            type: 'DELETE',
            success: function (result) {
                location.reload();
            },
            error: function (error) {
                console.log(error);
            }
        });
    })
});

$(document).ready(function () {
    $('#toast-container').fadeOut(3000);
});

$(document).ready(function () {

    $(document).on('click', '#search', function () {
        var query = $('#service_search').val();
        if (query !== '') {
            $.ajax({
                url: "/services/search",
                method: "GET",
                data: { query: query },
                dataType: "json",
                success: function (data) {
                    let i = 1;
                    let output = '<table id="service_table" class="service-table table table-bordered table-hover">\n' +
                        '<thead>\n' +
                        '<tr>\n' +
                        '<th>#</th>\n' +
                        '<th>სერვისის დასახელება</th>\n' +
                        '<th>სერვისის ღირებულება</th>\n' +
                        '<th>ხანგრძლივობა</th>\n' +
                        '<th>ვისთვის არის განკუთვნილი</th>' +
                        '<th></th>\n' +
                        '</tr>\n' +
                        '</thead>\n';
                    data.forEach((service) => {
                        const sexes = JSON.parse(service.sex);
                        let str = '';
                        for (key in sexes) { str += sexes[key] + ' ' }
                        output += '<tbody>\n' +
                            '<tr>\n' +
                            '<td scope="row">' + i + '</td>\n' +
                            '<td>' + service.name + '</td>\n' +
                            '<td>' + service.cost + '</td>\n' +
                            '<td>' + service.duration + '</td>\n' +
                            '<td>' + str + '</td>\n' +
                            '<td>' +
                            '<span style="overflow: visible; width: 132px;">\n' +
                            '<a href="/organizations/' + service.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\n' +
                            '<i class="la la-edit"></i>\n' +
                            '</a>' +
                            '<a href="#" id="del" uid="' + service.id + '" class="user-del m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\n' +
                            '<i class="la la-trash"></i>\n' +
                            '</a>\n';
                        '</span></td></tr></tbody>\n'
                        i++;
                    });
                    output += '</table>'
                    console.log(output);
                    $('.service-table').remove();
                    $('.pagination').remove();
                    $("#searched").append(output);
                }
            });
        }
    });
});

