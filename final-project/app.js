const express = require("express");
const ejs = require("ejs");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const admin = require("./admin");
const path = require("path");

// add mongo
const { mongoConnect } = require("./util/database");

// add routes
const clientRoute = require("./route/clientRoute");

// create server
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ urlencoded: false, extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "html");
app.engine("html", ejs.renderFile);

// set up cookie
app.use(cookieParser());


app.use("/admin", admin);

// apply routes
app.use(clientRoute);

// error page
app.use((req, res, next) => {
    res.status(404).send("Page Not Found");
});

mongoConnect(() => {
    app.listen(3000);
});

// app.listen(3000);