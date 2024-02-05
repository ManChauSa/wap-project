const express = require("express");
const ejs = require("ejs");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const admin = require("./admin");
const path = require("path");

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

app.use(cookieParser());

app.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.use("/admin", admin);

app.use((req, res, next) => {
    res.status(404).send("Page Not Found");
});

app.listen(3000);