function logout() {
  $.ajax({
    url: "/logout",
    method: "GET",
    success: function (response) {
      window.location.href = "/";
    },
    error: function (error) {
      console.log("Error");
    },
  });
}

function order(self) {
  const id = $(self).closest(".menu-card-sl").attr("id")
    ? $(self).closest(".menu-card-sl").attr("id")
    : $(self).closest(".menu-card-bg").attr("id")
    ? $(self).closest(".menu-card-bg").attr("id")
    : $(self).closest(".tabcontent-item").attr("id");
  $.ajax({
    url: "/order",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ id: id }),
    success: function (response) {
      if (response.isLogin) {
        $(".total-number").html(response.totalQuantity);
        let cartHtml = "";
        let cart = response.cart;
        for (let i = 0; i < cart.length; i++) {
          cartHtml +=
            `
            <div class="cart-item">
      <p class="item-title">` +
            cart[i].title +
            `</p>
      <p class="item quantity">x` +
            cart[i].quantity +
            `</p>
    </div>

            `;
          $(".cart-items").html(cartHtml);
        }
      } else {
        $("#pleaseLogin")
          .show()
          .css("animation", "fadeIn 0.5s ease-in-out forwards");
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function closePopup() {
  $("#pleaseLogin").css("animation", "fadeOut 0.5s ease-in-out forwards");
  setTimeout(() => {
    $("#pleaseLogin").hide().css("animation", "");
  }, 500);
}

function openCheckout() {
  $(".cart-popup").show().css("animation", "fadeIn 0.5s ease-in-out forwards");
}

function closeCheckout() {
  $(".cart-popup").css("animation", "fadeOut 0.5s ease-in-out forwards");
  setTimeout(() => {
    $(".cart-popup").hide().css("animation", "");
  }, 500);
}

function scrollToMainContent() {
  $("#main-content").get(0).scrollIntoView({
    behavior: "smooth",
  });
}

function openCity(evt, cityName) {
  $(".tabcontent").hide();

  $(".tablinks").removeClass("active");

  $("#" + cityName).show();
  $(evt.currentTarget).addClass("active");
}
