const express = require("express");
const ejs = require("ejs");
const cookieParser = require("cookie-parser");
const path = require("path");

const options = {
    "caseSensitive": true,
    "strict": true
};

const router = express.Router(options);

const fake_menu = {food: [{image: "https://media.tenor.com/odivpWLQNGkAAAAM/catbailando.gif",title: "1",description: "random text 1",price: 10,isPopular: true}, {image: "https://media.tenor.com/1KJMqEXCRH8AAAAM/meow-baby.gif",title: "2",description: "random text 2",price: 30, isPopular: false},{image: "https://media.tenor.com/SUv_UTpCX10AAAAM/womp-womp.gif",title: "3",description: "random text 3",price: 13,isPopular: false}, {image: "https://media.tenor.com/FcYkbZvdsyAAAAAM/cat-dancing.gif",title: "4",description: "random text 4",price: 15, isPopular: false}]};

const fake_employees = {employees: [{name: "Daisy", image: "https://i.kym-cdn.com/entries/icons/square/000/000/026/Gerard-Butler-This-Is-Sparta.jpg", position: "waiter"}, {name: "Jacka",image: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/Trollface_non-free.png/220px-Trollface_non-free.png", reception: "order"}]}

router.get('/index', (req,res,next)=>{
    let context = {}
    res.render("admin", context)
})

router.get('/menu', (req, res, next)=>{
    let context = fake_menu
    res.render("admin_menu", context)
})

router.get('/employees', (req, res, next)=>{
    let context = fake_employees
    res.render("admin_employee", context)
})

module.exports = router