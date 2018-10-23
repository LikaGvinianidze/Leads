/*
  Role submit handler
*/

// On save
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
      url: '/permissions/add',
      async: false,
      cache: false,
      data: form.serialize(),
      success: function (response) {
        console.log(response)
        $('.alert-error').hide();
        $('.alert-done').show();
        $("#form-validate")[0].reset();
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
    description: {
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
      url: '/permissions/' + $(this).attr('uid'),
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
