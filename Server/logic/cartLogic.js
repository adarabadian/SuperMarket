const cartDao = require("../dao/cartDao");
const userUtils = require("../utilities/userUtils");
const cartUtils = require("../utilities/cartUtils");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");


// get user cart function
const getUserCart = async (request) =>{
    const userId = await userUtils.getUserId(request);

    // check if user have cart
    let userCart = await cartUtils.getUserCart(userId);

    // callback for cartDao > get USER cart 
    return userCart;
}

// close user cart function, happens after an order is made, old cart moves to status closed and user gets a new one
const closeUserCart = async (userId)=>{
    await cartDao.closeUserCart(userId);
}


// open new user cart function, happens after an order is made, old cart moves to status closed and user gets a new one
const createNewCart = async (request)=>{
    const userId = await userUtils.getUserId(request);

    // create user cart
    let creationDate = new Date();
    await cartDao.createNewCart(userId, creationDate);
}


// add prod to cart function
const addProductToCart = async (request)=>{
    const userId = await userUtils.getUserId(request);

    const productId = request.body.productId;
    const productAmount = request.body.productAmount;

    // validateProductUnitsAmount function validates that user didn't bypassed the client's restrictions and entered a valid data
    await validateProductUnitsAmount(productAmount)
    
    // function gets the price from db because data gotten from user cannot be trusted 
    const unitPrice = await getProductUnitPrice(productId);
    const totalPrice = unitPrice * productAmount;
    
    // getUserCartId
    const userCartIdFromDb = await cartDao.getUserCartId(userId);
    const userCartId = userCartIdFromDb[0].ID;
    
    // add product to db
    await cartDao.addProductToCart(productId, productAmount, totalPrice, userCartId);
}

// update product amount
const updateProductAmount = async  (request)=>{
    const userId = await userUtils.getUserId(request);

    const productId = request.body.productId;
    const productAmount = request.body.productAmount;

    // validateProductUnitsAmount function validates that user didn't bypassed the client's restrictions and entered a valid data
    await validateProductUnitsAmount(productAmount);

    // function gets the price from db because data gotten from user cannot be trusted 
    const unitPrice = await getProductUnitPrice(productId);
    const totalPrice = unitPrice * productAmount;
    
    // getUserCartId
    const userCartIdFromDb = await cartDao.getUserCartId(userId);
    const userCartId = userCartIdFromDb[0].ID;

    // update product in db
    await cartDao.updateProductAmount(productId, productAmount, totalPrice, userCartId);
}


// function gets the price from db because data gotten from user cannot be trusted 
const getProductUnitPrice = async (productId)=>{
    const sqlResult = await cartDao.getProductUnitPrice(productId);
    return sqlResult[0].Price;
}


// validateProductUnitsAmount function validates that user didn't bypassed the client's restrictions and entered a valid data
const validateProductUnitsAmount = (productAmount) =>{
    if (productAmount < 1 || productAmount > 99 || productAmount % 1 != 0){
        throw new ServerError(ErrorType.PRODUCT_AMOUNT_INVALID);
    }
}

// remove product from cart function
const deleteProductFromCart = async (request)=>{
    const userId = await userUtils.getUserId(request);
    const productId = request.params.productid;
    
    // getUserCartId
    const userCartIdFromDb = await cartDao.getUserCartId(userId);
    const userCartId = userCartIdFromDb[0].ID;

    // remove product from cart that saved in db
    await cartDao.deleteProductFromCart(productId, userCartId);
}

// empty user cart function (dont open a new one though)
const emptyUserCart = async (request)=>{
    const userId = await userUtils.getUserId(request);
    
    // getUserCartId
    const userCartIdFromDb = await cartDao.getUserCartId(userId);
    const userCartId = userCartIdFromDb[0].ID;

    // remove all products from cart that saved in db
    await cartDao.emptyUserCart(userCartId);
}



module.exports = {
    getUserCart,
    createNewCart,
    addProductToCart,
    updateProductAmount,
    deleteProductFromCart,
    emptyUserCart,
    closeUserCart
}