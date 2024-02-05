const express = require('express');
const path =require('path');
const cart = express.Router();

let products = [
    {
      id: "p-1",
      title: "NEW Hot Honey Wings",
      img: "../img/classic-cheese-pizza-recipe-2-64429a0cb408b.jpg",
      description: "Habanero-infused honey sauce & Cajun Style Dru Rub",
      isPopular: false,
      price:45
    },
    {
      id: "p-2",
      title: "NEW Hot Honey Wings",
      img: "../img/_optaboutcomcoeusresourcescontent_migrationsimply_recipesuploads201909_easy-pepperoni-pizza-lead-3-8f256746d649404baa36a44d271329bc.jpg",
      description: "Habanero-infused honey sauce & Cajun Style Dru Rub",
      isPopular: true,
      price:35
    },
    {
      id: "p-3",
      title: "NEW Hot Honey Wings",
      img: "../img/pizza-recipe-1.jpg",
      description: "Habanero-infused honey sauce & Cajun Style Dru Rub",
      isPopular: true,
      price:14
    },
    {
      id: "p-4",
      title: "NEW Hot Honey Wings",
      img: "../img/classic-cheese-pizza-recipe-2-64429a0cb408b.jpg",
      description: "Habanero-infused honey sauce & Cajun Style Dru Rub",
      isPopular: true,
      price:32
    },
    {
      id: "p-5",
      title: "NEW Hot Honey Wings",
      img: "../img/classic-cheese-pizza-recipe-2-64429a0cb408b.jpg",
      description: "Habanero-infused honey sauce & Cajun Style Dru Rub",
      isPopular: true,
      price:32
    },
  ];
let orderList=[];

cart.get('/cart',(req,res,next)=>{
    let listOr=[];
    var orderList =req.cookies.cart;
    for(let order of orderList){
        var product = products.find(p=>p.id == order.id);
        var item = {id: product.id, image:product.img, title:product.title, description:product.description,price:product.price,quantity:order.quantity};
        listOr.push(item);
    }
    res.render('cart',{subTotal:subTotal(orderList), listOrders: listOr , totalQuantity: orderList.reduce((total, item) => total + item.quantity, 0)});
})
cart.post('/updateOrder',(req,res)=>{
    var orderList =req.cookies.cart;
    var item = orderList.find(v => v.id == req.body.id);
    if (req.body.type == 'btn_minus') { 
         item.quantity--;       
    }
    if(req.body.type =='btn_plus'){
        item.quantity++;
    }
    if(req.body.type =='btn_delete')  {
        orderList.splice(orderList.indexOf(item),1)
        
    }
    // Set cookies
    res.cookie("cart", orderList);
    res.json({subTotal:subTotal(orderList), quantity:  item.quantity,totalQuantity:orderList.reduce((total, item) => total + item.quantity, 0), disabled: item.quantity ==0 });
})
cart.post('/onChange',(req,res)=>{    
    var orderList =req.cookies.cart;
    var item = orderList.find(v => v.id == req.body.id);
    item.quantity = parseInt(req.body.quantity);  
    res.cookie("cart", orderList);
    res.json({ totalQuantity:orderList.reduce((total, item) => total + item.quantity, 0),
        subTotal:subTotal(orderList)});
})
cart.post('/sammary',(req,res)=>{
    let orders=[];
    var orderList =req.cookies.cart;
    for(let order of orderList){
        var product = products.find(p=>p.id == order.id);
        var item = {title:product.title, price:product.price, quantity:order.quantity};
        orders.push(item);
    }
    var delivery = 0;
    var sale = 0;
    if(req.body.delivery == '0'){
        delivery =15;
    }
    if(req.coupon_reduce =='true'){
        sale = req.total*0.1;
    }
    var data ={
        orders:orders,
        sale:sale,
        delivery: delivery,
        total: req.body.total,
        sub:req.body.sub_total_val,
    }
    
    console.log('data',data)
    res.render('checkout',{data:data});

})

function subTotal(orderList){
    var result =0;
    for(let item of orderList){
        var price =products.find(p=>p.id == item.id).price;
        result +=item.quantity* price;
    }
    return result;
}

module.exports = cart;