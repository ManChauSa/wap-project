function signup() {
  let username = $("input[name='username']").val();
  let password = $("input[name='password']").val();
  $.ajax({
    url: "/signup",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ username: username, password: password }),
    success: function (response) {
      $(".error").hide();
      $(".success").show();
    },
    error: function (error) {
      $(".error").show();
      $(".success").hide();
    },
  });
}
