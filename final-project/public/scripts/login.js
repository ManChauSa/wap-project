function login() {
  let username = $("input[name='username']").val();
  let password = $("input[name='password']").val();
  $.ajax({
    url: "/login",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ username: username, password: password }),
    success: function (response) {
      $(".error").hide();
      window.location.href = "/";
    },
    error: function (error) {
      $(".error").show();
    },
  });
}
