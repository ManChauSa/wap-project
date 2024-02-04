const express = require("express");

const route = express.Router();

let users = [{ username: "linh", password: "linh" }];

let products = [
  {
    id: "p-1",
    title: "NEW Hot Honey Wings",
    img: "../img/classic-cheese-pizza-recipe-2-64429a0cb408b.jpg",
    description: "Habanero-infused honey sauce & Cajun Style Dru Rub",
    price: 12.5,
    isPopular: false,
  },
  {
    id: "p-2",
    title: "NEW Hot Honey Wings",
    img: "../img/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2019__09__easy-pepperoni-pizza-lead-3-8f256746d649404baa36a44d271329bc.jpg",
    description: "Habanero-infused honey sauce & Cajun Style Dru Rub",
    price: 12.5,
    isPopular: true,
  },
  {
    id: "p-3",
    title: "NEW Hot Honey Wings",
    img: "../img/pizza-recipe-1.jpg",
    description: "Habanero-infused honey sauce & Cajun Style Dru Rub",
    price: 12.5,
    isPopular: true,
  },
  {
    id: "p-4",
    title: "NEW Hot Honey Wings",
    img: "../img/classic-cheese-pizza-recipe-2-64429a0cb408b.jpg",
    description: "Habanero-infused honey sauce & Cajun Style Dru Rub",
    price: 12.5,
    isPopular: true,
  },
  {
    id: "p-5",
    title: "NEW Hot Honey Wings",
    img: "../img/classic-cheese-pizza-recipe-2-64429a0cb408b.jpg",
    description: "Habanero-infused honey sauce & Cajun Style Dru Rub",
    price: 17,
    isPopular: true,
  },
];

let popularProducts = products.filter((product) => product.isPopular);

let topThreePopularProducts = popularProducts.slice(0, 3);
route.get("/login", (req, res, next) => {
  let username = req.cookies.username;
  if (username) {
    res.redirect("/");
  }
  res.render("login");
});

route.get("/signup", (req, res, next) => {
  let username = req.cookies.username;
  if (username) {
    res.redirect("/");
  }
  res.render("signup");
});

route.post("/signup", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  let validUser = true;
  for (const user of users) {
    if (user.username === username) {
      validUser = false;
      break;
    }
  }
  if (validUser) {
    users.push({ username: username, password: password });
    res.json({ success: true });
  } else {
    throw new Error("User is already existed");
  }
});

route.get("/logout", (req, res, next) => {
  res.clearCookie("username");
  res.clearCookie("cart");
  res.redirect("/");
});

route.post("/login", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  let validUser = false;
  for (const user of users) {
    if (user.username === username && user.password === password) {
      validUser = true;
      break;
    }
  }
  if (validUser) {
    res.cookie("username", username);
    res.json({ success: true });
  } else {
    throw new Error("Invalid username/password");
  }
});

route.post("/order", (req, res, next) => {
  let username = req.cookies.username;
  let cart = req.cookies.cart;
  if (!username) {
    res.json({ isLogin: false });
  } else {
    const { id } = req.body;
    let product = products.find((product) => product.id === id);
    let newItem = {
      id: product.id,
      title: product.title,
      quantity: 1,
    };
    if (!cart) {
      cart = [newItem];
    } else {
      const existingItem = cart.find((item) => item.id === newItem.id);
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        cart.push(newItem);
      }
    }
  }
  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  res.cookie("cart", cart);
  res.json({ isLogin: true, totalQuantity: totalQuantity, cart: cart });
});

route.get("/menu", (req, res, next) => {
  let username = req.cookies.username;
  let cart = req.cookies.cart;
  let totalQuantity = 0;
  if (cart) {
    totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  } else {
    cart = [];
  }
  res.render("menu", {
    username: username,
    products: products,
    topThreePopularProducts: topThreePopularProducts,
    size: totalQuantity,
    cart: cart,
  });
});

route.get("/", (req, res, next) => {
  let username = req.cookies.username;
  let cart = req.cookies.cart;
  let totalQuantity = 0;
  if (cart) {
    totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  } else {
    cart = [];
  }
  res.render("index", {
    username: username,
    products: products,
    topThreePopularProducts: topThreePopularProducts,
    size: totalQuantity,
    cart: cart,
  });
});

module.exports = route;
