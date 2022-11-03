const express = require("express");
const router = express.Router();
const cartLogic = require("../logic/cartLogic");


router.get("/", async (request, response, next) => {
    try {
        // callback for cartLogic > doesUserHaveCart
        const userCart = await cartLogic.getUserCart(request);

        // return all cart
        response.json(userCart);
    }
    catch (error) {
        next(error);
    }
});


router.post("/createNewCart", async (request, response, next) => {
    try {
        // callback for cartLogic > create new cart
        await cartLogic.createNewCart(request);
        response.json();
    }
    catch (error) {
        next(error);
    }
});


router.put("/updateProductAmount", async (request, response, next) => {
    try {
        // callback for cartLogic > create new cart
        await cartLogic.updateProductAmount(request);
        response.json();
    }
    catch (error) {
        next(error);
    }
});

// delete product from shopping cart
router.delete("/emptyUserCart", async (request, response, next) => {
    try {
        // callback for cartLogic > create new cart
        await cartLogic.emptyUserCart(request);
        response.json();
    }
    catch (error) {
        next(error);
    }
});


// delete product from shopping cart
router.delete("/:productid", async (request, response, next) => {
    try {
        // callback for cartLogic > create new cart
        await cartLogic.deleteProductFromCart(request);
        response.json();
    }
    catch (error) {
        next(error);
    }
});

// add product to user's shopping cart
router.post("/", async (request, response, next) => {
    try {
        // callback for cartLogic > create new cart
        await cartLogic.addProductToCart(request);
        response.json();
    }
    catch (error) {
        next(error);
    }
});

module.exports = router;