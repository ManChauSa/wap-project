const express = require("express");
const ejs = require("ejs");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const cookieParser = require("cookie-parser");
const path = require("path");

const options = {
    caseSensitive: true,
    strict: true,
};

// Set up storage for multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Specify the directory where you want to save the files
        cb(null, path.join(__dirname, "public/img"));
    },
    filename: function(req, file, cb) {
        // Specify the name format for saved files (in this case, use the original file name)
        const uniqueName = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

const upload = multer({ storage: storage });

const router = express.Router(options);

const fake_menu = {
    food: [{
            id: 1,
            image: "https://media.tenor.com/odivpWLQNGkAAAAM/catbailando.gif",
            title: "1",
            description: "random text 1",
            price: 10,
            isPopular: true,
        },
        {
            id: 2,
            image: "https://media.tenor.com/1KJMqEXCRH8AAAAM/meow-baby.gif",
            title: "2",
            description: "random text 2",
            price: 30,
            isPopular: false,
        },
        {
            id: 3,
            image: "https://media.tenor.com/SUv_UTpCX10AAAAM/womp-womp.gif",
            title: "3",
            description: "random text 3",
            price: 13,
            isPopular: false,
        },
        {
            id: 4,
            image: "https://media.tenor.com/FcYkbZvdsyAAAAAM/cat-dancing.gif",
            title: "4",
            description: "random text 4",
            price: 15,
            isPopular: false,
        },
    ],
};

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

const fake_checkout = {
    checkouts: [{
            id: 1,
            product_id: 2,
            quantity: 3
        },
        {
            id: 2,
            product_id: 1,
            quantity: 4
        },
        {
            id: 3,
            product_id: 3,
            quantity: 2
        },
        {
            id: 4,
            product_id: 4,
            quantity: 67
        },
        {
            id: 5,
            product_id: 2,
            quantity: 123
        },
        {
            id: 6,
            product_id: 2,
            quantity: 42
        },
        {
            id: 7,
            product_id: 3,
            quantity: 12
        }
    ]
}

router.get("/index", (req, res, next) => {
    let context = {};
    res.render("admin", context);
});

router.get("/menu", (req, res, next) => {
    let context = fake_menu;
    res.render("admin_menu", context);
});

router.post("/update_menu", (req, res, next) => {
    // TODO
    console.log(req.body);
});

router.post("/new_menu_image", upload.single("file"), (req, res) => {
    const savedFilename = req.file.filename;
    return res.json({ filename: savedFilename });
});

router.get("/employees", (req, res, next) => {
    let context = fake_employees;
    res.render("admin_employee", context);
});

router.get("/checkout", (req, res, next) => {
    let data = fake_checkout;
    let report = {}
    for (let frame of data.checkouts) {
        console.log(frame)
        if (report[frame['product_id']]) {
            report[frame['product_id']] += frame['quantity']
        } else {
            report[frame['product_id']] = frame['quantity']
        }
    }
    console.log(report)
    res.render("admin_checkout", { report: report });
});

module.exports = router;