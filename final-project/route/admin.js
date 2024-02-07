const express = require("express");
const ejs = require("ejs");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const cookieParser = require("cookie-parser");
const Product = require("../models/product");
const User = require("../models/user");
const Checkout = require("../models/checkout");
const path = require("path");

const options = {
    caseSensitive: true,
    strict: true,
};

// Set up storage for multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Specify the directory where you want to save the files
        cb(null, path.join(__dirname, "../public/img"));
    },
    filename: function(req, file, cb) {
        // Specify the name format for saved files (in this case, use the original file name)
        const uniqueName = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

const upload = multer({ storage: storage });

const router = express.Router(options);

const fake_employees = {
    employees: [{
            name: "Daisy",
            image: "https://i.kym-cdn.com/entries/icons/square/000/000/026/Gerard-Butler-This-Is-Sparta.jpg",
            position: "waiter",
        },
        {
            name: "Jacka",
            image: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/Trollface_non-free.png/220px-Trollface_non-free.png",
            position: "reception",
        },
    ],
};

const foodTypes = ["pizza", "salad", "starter"]
router.get("/index", (req, res, next) => {
    if (req.cookies.admin) {
        let context = {};
        res.render("admin", context);
    } else {
        res.status(404).json({ error: "Internal Server Error" })
    }
});

router.get("/menu", async(req, res, next) => {
    if (req.cookies.admin) {
        let context = { food: [] }
        for (let type of foodTypes) {
            let items = await Product.getAllProductsByType(type);
            for (let item of items) {
                item.type = type
            }
            context.food.splice(0, 0, ...items)
        }
        res.render("admin_menu", context);
    } else {
        res.status(404).json({ error: "Internal Server Error" })
    }
});

router.post("/update_menu", (req, res, next) => {
    if (req.cookies.admin) {
        let data = req.body;
        data.price = parseFloat(data.price)
        let type = data.type
        delete data.type
        let productId = data.id;
        if (productId) {
            delete data.id;
            console.log("Update data to product")
            console.log(productId)
            console.log(data)
            Product.updateProductById(type, productId, data);
        } else {
            console.log("Add new data to product")
            console.log(data)
            Product.addProduct(type, data);
        }
    } else {
        res.status(404).json({ error: "Internal Server Error" })
    }
});

router.post("/new_menu_image", upload.single("file"), (req, res) => {
    if (req.cookies.admin) {
        const savedFilename = req.file.filename;
        res.json({ filename: savedFilename });
    } else {
        res.status(404).json({ error: "Internal Server Error" })
    }
});

router.get("/employees", (req, res, next) => {
    if (req.cookies.admin) {
        let context = fake_employees;
        res.render("admin_employee", context);
    } else {
        res.status(404).json({ error: "Internal Server Error" })
    }
});

router.get("/checkout", async(req, res, next) => {
    if (req.cookies.admin) {
        let users = await User.getAllUsers()
        let checkouts = await Checkout.getAllHistory();
        let report = {}

        for (let user of users) {
            report[user.username] = []
        }
        for (let c of checkouts) {
            report[c.userName].push({ date: c.date, price: c.price })
        }
        res.render("admin_checkout", { report: report });
    } else {
        res.status(404).json({ error: "Internal Server Error" })
    }
});

router.get("/logout", (req, res, next) => {
    res.clearCookie("username");
    res.clearCookie("cart");
    res.clearCookie("admin")
    res.redirect("/");
});

module.exports = router;