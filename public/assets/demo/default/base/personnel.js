/*
  Role submit handler
*/

var customMessages = {
  1062: 'ამ ელ-ფოსტით ჩანაწერი უკვე არსებობს',
  1292: 'თარიღი შეიყვანეთ სწორი ფორმატით (YYYY-MM-DD)'
};

// On save
$("#form-validate").validate({
  rules: {
    firstname: {
      required: true,
      minlength: 2
    },
    lastname: {
      required: true,
      minlength: 4
    },
    email: {
      required: true,
      email: true
    },
    phone: {
      number: true,
      minlength: 6
    },
    facebook: {
      required: false
    },
    service: {
      required: true
    }
  },
  messages: {
    firstname: {
      required: "ეს ველი აუცილებელია!",
      minlength: jQuery.validator.format("შეიყვანეთ არა ნაკლებ {0} სიმბოლო.")
    },
    lastname: {
      required: "ეს ველი აუცილებელია!",
      minlength: jQuery.validator.format("შეიყვანეთ არა ნაკლებ {0} სიმბოლო.")
    },
    email: {
      required: "ეს ველი აუცილებელია!",
      email: "თქვენი ელ. ფოსტის მისამართი უნდა ემთხვეოდეს შემდეგ ფორმატს: name@domain.com"
    },
    phone: {
      number: "უნდა შეიცავდეს მხოლოდ ციფრებს.",
      minlength: jQuery.validator.format("შეიყვანეთ არა ნაკლებ {0} სიმბოლო.")
    },
    service: {
      required: "ეს ველი აუცილებელია!"
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
      url: '/personnel/add',
      async: false,
      cache: false,
      data: form.serialize(),
      success: function (response) {
        window.location.href = '/personnel';
      },
      error: function (error) {
        console.log('error is', error);
        var key = error.responseJSON.errno;
        $('.alert-error').show();
        $('#errmsg').text(customMessages[key]);
        $("html, body").animate({ scrollTop: 0 }, "slow");
      }
    });
  }
});

// On update
$("#form-update").validate({
  rules: {
    firstname: {
      required: false,
      minlength: 2
    },
    lastname: {
      required: false,
      minlength: 4
    },
    email: {
      required: false,
      email: true
    },
    phone: {
      number: false,
      minlength: 6
    },
    facebook: {
      required: false,
    }
  },
  messages: {
    firstname: {
      minlength: jQuery.validator.format("შეიყვანეთ არა ნაკლებ {0} სიმბოლო.")
    },
    lastname: {
      minlength: jQuery.validator.format("შეიყვანეთ არა ნაკლებ {0} სიმბოლო.")
    },
    email: {
      email: "თქვენი ელ. ფოსტის მისამართი უნდა ემთხვეოდეს შემდეგ ფორმატს: name@domain.com"
    },
    phone: {
      number: "უნდა შეიცავდეს მხოლოდ ციფრებს.",
      minlength: jQuery.validator.format("შეიყვანეთ არა ნაკლებ {0} სიმბოლო.")
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
      },
      error: function (error) {
        console.log('error is', error);
      }
    });
  }
});


$(document).ready(function () {
  $('.empservice').click(function () {
    console.log('clicked')
    $.ajax({
      url: '/personnel/services/' + $(this).attr('sid') + '/' + $(this).attr('eid'),
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

// On Delete
$(document).ready(function () {
  $('.user-del').click(function () {
    $.ajax({
      url: '/personnel/' + $(this).attr('uid'),
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

$(document).ready(function() {
  $('#toast-container').fadeOut(3000);
});

// On Search
$(document).ready(function () {

  $(document).on('click', '#search', function() {
    var query = $('#personnel_search').val();
    if (query !== '') {
      $.ajax({
        url: "/personnel/search",
        method: "GET",
        data: {query: query},
        dataType: "json",
        success: function (data) {
          let i = 1;
          let output = '<table id="personnel_table" class="personnel-table table table-bordered table-hover">\n' +
                        '<thead>\n' +
                          '<tr>\n' +
                            '<th>#</th>\n' +
                            '<th>სახელი</th>\n' +
                            '<th>გვარი</th>\n' +
                            '<th>მობილურის ნომერი</th>\n' +
                            '<th>ელ-ფოსტა</th>\n' +
                            '<th></th>\n' +
                          '</tr>\n' +
                        '</thead>\n';
          data.forEach((emp) => {
            output += '<tbody>\n' +
                      '<tr>\n' +
                        '<td scope="row">' + i + '</td>\n' +
                        '<td>' + emp.firstname + '</td>\n' +
                        '<td>' + emp.lastname + '</td>\n' +
                        '<td>' + emp.phone + '</td>\n' +
                        '<td>' + emp.email + '</td>\n' +
                        '<td>' +
                        '<span style="overflow: visible; width: 132px;">\n' +
                          '<a href="/personnel/' + emp.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\n' +
                            '<i class="la la-edit"></i>\n' +
                          '</a>' +
                          '<a href="#" id="del" uid="' + emp.id + '" class="user-del m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\n' +
                          '<i class="la la-trash"></i>\n' +
                          '</a>\n';
                        '</span></td></tr></tbody>\n'
            i++;
          });
          output += '</table>'
          console.log(output);
          $('.personnel-table').remove();
          $('.pagination').remove();
          $("#searched").append(output);
        }
      });
    }
  });
});


$('#org_select').on('change', function () {
  $.ajax({
      type: 'POST',
      url: '/',
      async: false,
      cache: false,
      data: {orgid: this.value},
      success: function (response) {
          location.reload();
      },

      error: function (error) {
          console.log('error is', error.message);
          $('#org-notification').show(0).delay(4000).hide(0);
      }
  });
});
