const express = require("express");
const ejs = require("ejs");
const cookieParser = require("cookie-parser");
const path = require("path");

// add mongo
const { mongoConnect } = require("./util/database");

// add routes
const clientRoute = require("./route/clientRoute");
const cart = require("./route/cart");

// create server
const app = express();

// for upcoming request
app.use(express.json());
app.use(express.urlencoded({ urlencoded: false }));

// for css file
app.use(express.static(path.join(__dirname, "public")));

// set up view engine
app.set("view engine", "html");
app.engine("html", ejs.renderFile);

// set up cookie
app.use(cookieParser());

// apply routes
app.use(clientRoute);
app.use(cart);

// error page
app.use((req, res, next) => {
  res.status(404).send("Page Not Found");
});

mongoConnect(() => {
  app.listen(3000);
});

// app.listen(3000);
