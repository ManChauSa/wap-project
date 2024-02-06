const express = require("express");
const User = require("../models/user");
const Product = require("../models/product");
const route = express.Router();

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

route.post("/signup", async (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  let validUser = true;
  const existingUser = await User.findByUsername(username);
  if (existingUser) {
    validUser = false;
  }
  if (validUser) {
    const newUser = new User(username, password);
    await newUser.save();
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

route.get("/logout", (req, res, next) => {
  res.clearCookie("username");
  res.clearCookie("cart");
  res.redirect("/");
});

route.post("/login", async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const user = await User.login(username, password);
    if (user) {
      res.cookie("username", username);
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

route.post("/order", async (req, res, next) => {
  let username = req.cookies.username;
  let cart = req.cookies.cart;
  if (!username) {
    res.json({ isLogin: false });
  } else {
    const { id, type } = req.body;

    let product = await Product.findProductById(type, id);
    let newItem = {
      id: product._id,
      title: product.title,
      quantity: 1,
      type: type
    };
    if (!cart) {
      cart = [newItem];
    } else {
      const existingItem = cart.find(
        (item) => item.id.toString() === newItem.id.toString()
      );
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

route.get("/menu", async (req, res, next) => {
  let username = req.cookies.username;
  let cart = req.cookies.cart;
  let totalQuantity = 0;
  let items_per_page = 5;
  let pizzas = await Product.getProductsByPage(1, "pizza", items_per_page);
  let fullPizzas = await Product.getAllProductsByType("pizza");
  let totalItems = fullPizzas.length;

  if (cart) {
    totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  } else {
    cart = [];
  }
  res.render("menu", {
    username: username,
    pizzas: pizzas,
    size: totalQuantity,
    cart: cart,
    items_per_page: items_per_page,
    totalProducts: totalItems,
    currentPage: 1,
    hasNextPage: items_per_page * 1 < totalItems,
    hasPreviousPage: false,
    nextPage: 2,
    previousPage: 0,
    lastPage: Math.ceil(totalItems / items_per_page),
  });
});

route.post("/getProductByPage", async (req, res, next) => {
  const { page, items_per_page, type } = req.body;
  let products = await Product.getProductsByPage(page, type, items_per_page);
  let fullProducts = await Product.getAllProductsByType(type);
  let totalItems = fullProducts.length;
  if (products) {
    res.json({
      success: true,
      products: products,
      totalProducts: totalItems,
      currentPage: page,
      hasNextPage: items_per_page * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / items_per_page),
    });
  } else {
    res.json({ success: false });
  }
});

route.get("/", async (req, res, next) => {
  let username = req.cookies.username;
  let cart = req.cookies.cart;
  let pizzas = await Product.getAllProductsByType("pizza");
  let popularPizzas = pizzas.filter((product) => product.isPopular);
  let topThreePopularPizzas = popularPizzas.slice(0, 3);
  let totalQuantity = 0;
  if (cart) {
    totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  } else {
    cart = [];
  }
  res.render("index", {
    username: username,
    products: pizzas,
    topThreePopularProducts: topThreePopularPizzas,
    size: totalQuantity,
    cart: cart,
  });
});

module.exports = route;
