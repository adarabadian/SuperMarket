const express = require("express");
const router = express.Router();
const ordersLogic = require("../logic/ordersLogic");
const fs = require('fs');


router.get("/isFirstOrder", async (request, response, next) => {
    try {
        // callback for ordesLogic > isFirstOrder
        const isFirstOrderResult = await ordersLogic.isFirstOrder(request);

        // return first order status
        response.json(isFirstOrderResult);
    }
    catch (error) {
        next(error);
    }
});


router.get("/getOrdersAmount", async (request, response, next) => {
    try {
        // callback for ordersLogic > getOrdersAmount
        const ordersAmount = await ordersLogic.getOrdersAmount();

        // return all orders
        response.json(ordersAmount);
    }
    catch (error) {
        next(error);
    }
});


router.post("/", async (request, response, next) => {
    try {
        // callback for ordersLogic > orderUserCart
        await ordersLogic.orderUserCart(request);
        response.json()
    }
    catch (error) {
        next(error);
    }
});

router.post("/sendInvoiceEmail", async (request, response, next) => {
    let data = request.body.binary;
    let buff = new Buffer(data);
    
    let base64data = buff.toString('base64');
    
    let file = fs.writeFileSync('stack-abuse-logo-out.png', buff);
    return(file);

    // try {
    //     // callback for ordersLogic > orderUserCart
    // }
    // catch (error) {
    //     next(error);
    // }
});


module.exports = router;