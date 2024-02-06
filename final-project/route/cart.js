const express = require('express');
const Product = require("../models/product");
const path =require('path');
const cart = express.Router();


let orderList=[];

cart.get('/cart',async (req,res,next)=>{
    let listOr=[];
    var orderList =req.cookies.cart;
    var data ={sammury: { subTotal: 0,  tax: 0,totalIncl:0 },
        listOrders: listOr ,
        totalQuantity: 0};
        
    if(orderList !=undefined){
        var subTotal =0;
        for(let order of orderList){
            var product = await Product.findProductById(order.type, order.id);
            subTotal += product.price * order.quantity;
            var item = {id: order.id, 
                image:product.img, 
                title:product.title, 
                description:product.description,
                price:product.price,
                quantity:order.quantity};
            listOr.push(item);
        }
        data.sammury.subTotal =subTotal.toFixed(2);
        data.sammury.tax = (subTotal * 0.1).toFixed(2);
        data.sammury.totalIncl =(subTotal+(subTotal * 0.1) + 15).toFixed(2) ;
        data.listOrders =listOr;
        data.quantity= orderList.reduce((total, item) => total + item.quantity, 0);
    }
    
    res.cookie('listOrders',listOr);
    res.render('cart',{data: data});

})
cart.post('/updateOrder',async (req,res)=>{
    var orderList =req.cookies.cart;
    var item = orderList.find(v => v.id == req.body.id);    
    var listOrderDetail= req.cookies.listOrders;
    var detailItemUpdate = listOrderDetail.find(d=>d.id == req.body.id);

    if (req.body.type == 'btn_minus') { 
         item.quantity--;       
         detailItemUpdate.quantity--;       
    }
    if(req.body.type =='btn_plus'){
        item.quantity++;       
        detailItemUpdate.quantity++;   
    }
    if(req.body.type =='btn_delete')  {
        orderList.splice(orderList.indexOf(item),1);
        listOrderDetail.splice(listOrderDetail.indexOf(detailItemUpdate),1);
        
    }
    var subTotal=0;
    var totalQuantity=0;
    for(let detail of listOrderDetail){
        subTotal += detail.quantity * detail.price;
        totalQuantity  +=detail.quantity;
        
    }

    // Set cookies
    res.cookie("cart", orderList);
    res.cookie("listOrders", listOrderDetail);
    res.json({subTotal:subTotal,
         quantity:  detailItemUpdate.quantity,
         totalQuantity:totalQuantity,
         disabled: detailItemUpdate.quantity == 0 });
})
cart.post('/onChange',(req,res)=>{  
    var orderList =req.cookies.cart;
    var item = orderList.find(v => v.id == req.body.id);    
    var listOrderDetail= req.cookies.listOrders;
    var detailItemUpdate = listOrderDetail.find(d=>d.id == req.body.id);
    item.quantity = parseInt(req.body.quantity);  
    detailItemUpdate.quantity = parseInt(req.body.quantity);
    res.cookie("cart", orderList);
    res.cookie("listOrders", listOrderDetail);
    var subTotal =0;
    var totalQuantity =0;
    for(let item of listOrderDetail){
        subTotal +=item.quantity* item.price;
        totalQuantity +=item.quantity;
    }
    res.json({ totalQuantity:totalQuantity,
        subTotal:subTotal});
})



cart.post('/sammary',(req,res)=>{
    let ordersDelivery=[];   
    var listOrderDetail= req.cookies.listOrders;

    for(let item of listOrderDetail){
        var product = {title:item.title, price:item.price, quantity:item.quantity};
        ordersDelivery.push(item);
    }
    var delivery = 0;
    var sale = 0;
    if(req.body.delivery == '0'){
        delivery =15;
    }
    if(req.body.coupon_reduce =='true'){
        sale = parseFloat(req.body.sub_total_val*0.1).toFixed(2);
    }
    var tax = parseFloat(req.body.sub_total_val*0.1).toFixed(2);
    var data ={
        orders:ordersDelivery,
        sale:sale,
        delivery: delivery,
        total: req.body.total,
        sub:req.body.sub_total_val,
        tax: tax
    }
    res.render('checkout',{data:data});

})

cart.get('/orderSuccess',(req,res)=>{
    res.clearCookie("cart");
    res.redirect('/');
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