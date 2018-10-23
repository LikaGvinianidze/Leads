/*
  Role submit handler
*/

// On save
$("#form-validate").validate({
  rules: {
    name: {
      required: true,
      minlength: 2
    },
    address: {
      required: true,
      minlength: 4
    },
    user_id: {
      required: true
    },
    packet_id: {
      required: true,
      number: true
    }
  },
  messages: {
    name: {
      required: "ეს ველი აუცილებელია!",
      minlength: jQuery.validator.format("შეიყვანეთ არა ნაკლებ {0} სიმბოლო.")
    },
    address: {
      required: "ეს ველი აუცილებელია!",
      minlength: jQuery.validator.format("შეიყვანეთ არა ნაკლებ {0} სიმბოლო.")
    },
    user_id: {
      required: "ეს ველი აუცილებელია!"
    },
    packet_id: {
      required: "ეს ველი აუცილებელია!",
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
      url: '/organizations/add',
      async: false,
      cache: false,
      data: form.serialize(),
      success: function (response) {
        window.location.href = '/organizations';
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
    name: {
      required: false,
      minlength: 2
    },
    address: {
      required: false,
      minlength: 5
    }
  },
  messages: {
    name: {
      minlength: jQuery.validator.format("შეიყვანეთ არა ნაკლებ {0} სიმბოლო.")
    },
    description: {
      minlength: jQuery.validator.format("შეიყვანეთ არა ნაკლებ {0} სიმბოლო.")
    }
  },
  submitHandler: function () {
    var form = $("#form-update");
    var value = $("#user_search").attr("value");

    var data = {
      org: form.serialize(),
      user_id: value
    };
    console.log(form.serialize(), '\n', data)
    $.ajax({
      type: 'PUT',
      url: window.location.pathname,
      async: false,
      cache: false,
      data: data,
      success: function (response) {
        location.reload();
      },
      error: function (error) {
        console.log('error is', error);
      }
    });
  }
});

// On user delete '/organizations/users?userId=' + $(this).attr('uid') + '&orgId=' + $(this).attr('oid')
$(document).ready(function () {
  $('.orguser').click(function () {
    console.log('clicked')
    $.ajax({
      url: '/organizations/users/' + $(this).attr('uid') + '/' + $(this).attr('oid'),
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
    console.log('clicked')
    $.ajax({
      url: '/organizations/' + $(this).attr('uid'),
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

  $('#user_search').keyup(function() {
    var query = $(this).val();

    if (query !== '') {
      $.ajax({
        url: "/users/search",
        method: "GET",
        data: {query: query},
        dataType: "json",
        success: function (data) {

          var output = '<ul class="">';
          if (data.length > 0) {
            var i = 0;
            while (i < data.length) {
              output += '<li class="userlist" value="' + 
                        data[i].id + '">' +
                        (data[i].firstname +
                        " " +
                        data[i].lastname).bold() +
                        " (" +
                        data[i].email +
                        ")" +
                        "</li>";

              i++;
            }
          }

          output += "</ul>"

          $("#user_list").fadeIn();
          $("#user_list").html(output);
        }
      });
    }
  });
  $(document).on('click', '.userlist', function() {
    $('#user_search').val($(this).text());
    $('#user_list').fadeOut();
  });
});

$(document).ready(function() {
  $('#toast-container').fadeOut(3000);
});

$(document).ready(function () {

  $(document).on('click', '#search', function() {
    var query = $('#org_search').val();
    if (query !== '') {
      $.ajax({
        url: "/organizations/search",
        method: "GET",
        data: {query: query},
        dataType: "json",
        success: function (data) {
          let i = 1;
          let output = '<table id="org_table" class="org-table table table-bordered table-hover">\n' +
                        '<thead>\n' +
                          '<tr>\n' +
                            '<th>#</th>\n' +
                            '<th>ორგანიზაციის დასახელება</th>\n' +
                            '<th>პაკეტი</th>\n' +
                            '<th>სტატუსი</th>\n' +
                            '<th>ბოლო გადახდის თარიღი</th>' +
                            '<th></th>\n' +
                          '</tr>\n' +
                        '</thead>\n';
          data.forEach((org) => {
            output += '<tbody>\n' +
                      '<tr>\n' +
                        '<td scope="row">' + i + '</td>\n' +
                        '<td>' + org.name + '</td>\n' +
                        '<td>' + org.pname + '</td>\n' +
                        '<td>' + org.status + '</td>\n' +
                        '<td>' + org.paydate + '</td>\n' +
                        '<td>' +
                        '<span style="overflow: visible; width: 132px;">\n' +
                          '<a href="/organizations/' + org.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\n' +
                            '<i class="la la-edit"></i>\n' +
                          '</a>' +
                          '<a href="#" id="del" uid="' + org.id + '" class="user-del m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\n' +
                          '<i class="la la-trash"></i>\n' +
                          '</a>\n';
                        '</span></td></tr></tbody>\n'
            i++;
          });
          output += '</table>'
          console.log(output);
          $('.org-table').remove();
          $('.pagination').remove();
          $("#searched").append(output);
        }
      });
    }
  });
});
