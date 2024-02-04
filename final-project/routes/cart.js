const express = require('express');
const path =require('path');
const cart = express.Router();

let listItems=[{id: 1,image:'../img/pizza-recipe-1.jpg', title:"pizza 1", description: "sise S",price:54},
{id: 2,image:'../img/pizza-recipe-1.jpg', title:"pizza 2 ", description: "sise S",price:34},
{id: 1,image:'../img/pizza-recipe-1.jpg', title:"pizza 11", description: "sise M",price:45},
{id: 2,image:'../img/pizza-recipe-1.jpg', title:"pizza 22", description: "sise S",price:54},
{id: 1,image:'../img/pizza-recipe-1.jpg', title:"pizza 111", description: "sise M",price:45}];
let orderList=[];

cart.get('/cart',(req,res,next)=>{
    let listOr=[];
    // let listItems = req.cookies.orderList;
    console.log('listItemsget car',listItems)
    for(let item of listItems){
        var exit =listOr.filter(o=>o.id == item.id).length;        
        var quantity =listItems.filter(l=>l.id == item.id).length;
        if(exit == 0){
            let it={id: item.id, image:item.image, title:item.title, description:item.description,price:item.price,total:quantity};
            listOr.push(it);
        }else{
            listOr.findIndex(i=>i.id == item.id).total = quantity;
        }
    }
    res.render('cart',{ listOrders: listOr });
})
cart.post('/updateOrder',(req,res)=>{
    if (req.body.type == 'btn_minus') { 
        var index = listItems.findIndex(v => v.id == req.body.id);
        if (index >= 0) {
            listItems.splice(index, 1);
        }
        var quantity = listItems.filter(l => l.id == req.body.id).length;
        
        // Set cookies
        res.cookie('quantity', quantity);
        res.cookie('disabled', listItems.filter(o => o.id == req.body.id).length == 0);

        // Construct and send response
        res.json({ quantity: quantity, disabled: listItems.filter(o => o.id == req.body.id).length == 0 });
    }
    if(req.body.type =='btn_plus'){
        
    }
})


module.exports = cart;