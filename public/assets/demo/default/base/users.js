/*
  User submit handler
*/

var customMessages = {
  1062: 'ამ ელ-ფოსტით ჩანაწერი უკვე არსებობს'
};

// On Save
$("#form-validate").validate({
  rules: {
    firstname: {
      required: true,
      minlength: 2
    },
    lastname: {
      required: true,
      minlength: 2
    },
    email: {
      required: true,
      email: true
    },
    phone: {
      number: true,
      minlength: 6
    },
    password: {
      required: true,
      minlength: 3
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
    password: {
      required: "ეს ველი აუცილებელია!",
      minlength: jQuery.validator.format("შეიყვანეთ არა ნაკლებ {0} სიმბოლო.")
    },
    phone: {
      number: "უნდა შეიცავდეს მხოლოდ ციფრებს.",
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
      url: '/users/add',
      async: false,
      cache: false,
      data: form.serialize(),
      success: function (response) {
        console.log(response)
        $('.alert-error').hide();
        window.location.href = '/users';
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


$("#form-update").validate({
  rules: {
    firstname: {
      required: false,
      minlength: 2
    },
    lastname: {
      required: false,
      minlength: 2
    },
    email: {
      required: false,
      email: true
    },
    phone: {
      number: true,
      minlength: 6
    },
    password: {
      required: false,
      minlength: 3
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
    password: {
      minlength: jQuery.validator.format("შეიყვანეთ არა ნაკლებ {0} სიმბოლო.")
    },
    phone: {
      number: "უნდა შეიცავდეს მხოლოდ რიცხვით მნიშვნელობებს.",
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

// On Delete
$(document).ready(function () {
  $('.user-del').click(function () {
    $.ajax({
      url: '/users/' + $(this).attr('uid'),
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

// On Search
$(document).ready(function () {

  $(document).on('click', '#search', function () {
    var query = $('#user_search').val();
    if (query !== '') {
      $.ajax({
        url: "/users/search",
        method: "GET",
        data: { query: query },
        dataType: "json",
        success: function (data) {
          let i = 1;
          let output = '<table id="users_table" class="users-table table table-bordered table-hover">\n' +
            '<thead>\n' +
            '<tr>\n' +
            '<th>#</th>\n' +
            '<th>სახელი</th>\n' +
            '<th>გვარი</th>\n' +
            '<th>მეილი</th>\n' +
            '<th>ტელეფონი</th>\n' +
            '<th>როლი</th>\n' +
            '<th></th>\n' +
            '</tr>\n' +
            '</thead>\n';
          data.forEach((user) => {
            output += '<tbody>\n' +
              '<tr>\n' +
              '<td scope="row">' + i + '</td>\n' +
              '<td>' + user.firstname + '</td>\n' +
              '<td>' + user.lastname + '</td>\n' +
              '<td>' + user.email + '</td>\n' +
              '<td>' + user.phone + '</td>\n' +
              '<td>' + user.name + '</td>\n' +
              '<td>' +
              '<span style="overflow: visible; width: 132px;">\n' +
              '<a href="/users/' + user.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\n' +
              '<i class="la la-edit"></i>\n' +
              '</a>';
            if (user.currentemail !== user.email) {
              output += '<a href="#" id="del" uid="' + user.id + '" class="user-del m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\n' +
                '<i class="la la-trash"></i>\n' +
                '</a>\n';
            }

            output += '</span></td></tr></tbody>\n'
            i++;
          });
          output += '</table>'

          $('.users-table').remove();
          $('.pagination').remove();
          $("#searched").append(output);
        }
      });
    }
  });
});
