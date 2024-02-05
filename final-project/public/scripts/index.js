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

function order(self, type) {
  const id = $(self).closest(".menu-card-sl").attr("id")
    ? $(self).closest(".menu-card-sl").attr("id")
    : $(self).closest(".menu-card-bg").attr("id")
    ? $(self).closest(".menu-card-bg").attr("id")
    : $(self).closest(".tabcontent-item").attr("id");
  $.ajax({
    url: "/order",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ id: id, type: type }),
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

function openTab(evt, tabName, type) {
  $(".tabcontent").hide();

  $(".tablinks").removeClass("active");
  showProductInPage(1, type);
  $("#" + tabName).show();
  $(evt.currentTarget).addClass("active");
}

function showProductInPage(page, type) {
  const items_per_page = 5;
  $.ajax({
    url: "/getProductByPage",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      page: page,
      items_per_page: items_per_page,
      type: type,
    }),
    success: function (response) {
      if (response.success) {
        const products = response.products;
        const totalProducts = response.totalProducts;
        const currentPage = response.currentPage;
        const hasNextPage = response.hasNextPage;
        const hasPreviousPage = response.hasPreviousPage;
        const nextPage = response.nextPage;
        const previousPage = response.previousPage;
        const lastPage = response.lastPage;
        console.log(hasNextPage);
        console.log(lastPage);
        let html = "";
        for (const product of products) {
          html +=
            `
            <div class="tabcontent-item" id="` +
            product._id.toString() +
            `">
            <div class="item-c1">
              <h3>` +
            product.title +
            `</h3>
              <h3 class="price">$` +
            product.price.toFixed(2) +
            `</h3>
            </div>
            <div class="item-c2">
              <p>` +
            product.description +
            `</p>
              <button
                type="button"
                class="btn-order"
                onclick="order(this, '` +
            type +
            `')"
              >
                Order
              </button>
            </div>
          </div>
            
            `;
        }

        let pagination = "";

        if (currentPage !== 1 && previousPage !== 1) {
          pagination +=
            `<button type="button" onclick="showProductInPage(1, '` +
            type +
            `')">
              1
            </button>`;
        }
        if (hasPreviousPage) {
          pagination +=
            `
          <button
            type="button"
            onclick="showProductInPage(` +
            previousPage +
            `, '` +
            type +
            `')"
          >
          ` +
            previousPage +
            `
          </button>
          `;
        }
        if (totalProducts > items_per_page) {
          pagination +=
            `
        <button type="button" class="active" onclick="showProductInPage(` +
            currentPage +
            `, ` +
            type +
            `)">
        ` +
            currentPage +
            `
        </button>
        
        `;
        }

        if (hasNextPage) {
          pagination +=
            `  
          <button
              type="button"
              onclick="showProductInPage(` +
            nextPage +
            `, '` +
            type +
            `')"
            >
            ` +
            nextPage +
            `
            </button>
          `;
        }
        if (lastPage !== currentPage && nextPage !== lastPage) {
          pagination +=
            `
          <button
              type="button"
              onclick="showProductInPage(` +
            lastPage +
            `, '` +
            type +
            `')"
            >
            ` +
            lastPage +
            `
            </button>
          `;
        }
        if (type === "pizza") {
          $(".pizzaContainer").html(html);
          $("#pizzaPagination").html(pagination);
        } else if (type === "salad") {
          $(".saladContainer").html(html);
          $("#saladPagination").html(pagination);
        } else {
          $(".starterContainer").html(html);
          $("#starterPagination").html(pagination);
        }
      }
    },
    error: function (error) {
      console.log("Something went wrong");
    },
  });
}
