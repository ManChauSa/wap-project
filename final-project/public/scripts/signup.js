function signup() {
  let username = $("input[name='username']").val();
  let password = $("input[name='password']").val();
  $.ajax({
    url: "/signup",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ username: username, password: password }),
    success: function (response) {
      if (response.success) {
        $(".error").hide();
        $(".success").show();
      } else {
        $(".error").show();
        $(".success").hide();
      }
    },
    error: function (error) {
      console.log("Something went wrong");
    },
  });
}
