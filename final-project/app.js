const express = require("express");
const ejs = require("ejs");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ urlencoded: false }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.engine("ejs", ejs.renderFile);

app.use(cookieParser());

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.use((req, res, next) => {
  res.status(404).send("Page Not Found");
});

app.listen(3000);
