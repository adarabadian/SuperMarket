const ordersDao = require("../dao/ordersDao");
const cartLogic = require("../logic/cartLogic");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");
const userUtils = require("../utilities/userUtils");
const cartUtils = require("../utilities/cartUtils");


const getOrdersAmount = async () =>{
    // callback for ordersDao > getOrdersAmount function
    const sqlResult = await ordersDao.getOrdersAmount();
    ordersAmount = sqlResult[0];

    // return all orders amount
    return ordersAmount;
}

// function that checks if its the first order of the user, if it is, client will show a message accordingly
const isFirstOrder = async (request) =>{
    const userId = await userUtils.getUserId(request);
    
    // check if user have orders
    let sqlResult = await ordersDao.doesUserHaveOrders(userId);

    // callback for ordersDao > get USER orders amount
    if (sqlResult.length > 0){
        return false
    }
    return true
}

// order the user's cart
const orderUserCart = async (request) =>{
    const userId = await userUtils.getUserId(request);
    const userCart = await cartUtils.getUserCart(userId);
    const city = request.body.city;
    const street = request.body.street;
    const creditCard = request.body.creditCard;
    const deliveryDate = request.body.deliveryDate;  

    // check if date is'nt too busy
    await checkIfDateAvailable(deliveryDate);

    await validateOrderDetails (request);
    // if user cheated the client and got here without any products in cart he will get an empty cart error
    if (userCart == false){
        throw new ServerError(ErrorType.USER_CART_EMPTY);
    }

    // sum total price
    let totalCartPrice = 0;
    userCart.forEach(product =>{
        totalCartPrice = totalCartPrice + (+product.price * product.amount);
    })
    
    // get last 4 digits of credit card
    let creditCardLastDigits = await getCreditCardEnd(creditCard);

    // set order details object
    let orderDetails = {
        userId: userId,
        cartId: userCart[0].cartId,
        totalPrice: totalCartPrice,
        city: city.trim(),
        street: street.trim(),
        deliveryDate: new Date(deliveryDate),
        purchaseDate: new Date(),
        creditCard: creditCardLastDigits
    }
    
    // order user cart
    await ordersDao.orderUserCart(orderDetails);

    // close user's cart
    await cartLogic.closeUserCart(userId); 

    // create new cart for user
    await cartLogic.createNewCart(request); 
}

// get last 4 digits of credit card
const getCreditCardEnd = async (creditCard) => {
    // need to convert it to string before slicing
    creditCard = creditCard+"";

    // return last 4 digits
    return  creditCard.slice(-4);
}

// check if date is'nt too busy
const checkIfDateAvailable = async (deliveryDate) => {
    // set deliveryDate
    deliveryDate = new Date(deliveryDate);
    deliveryDate.setHours(00);
    let theDayAfter = new Date(deliveryDate);
    theDayAfter.setHours(00);
    theDayAfter.setDate(theDayAfter.getDate()+1);

    // check if date is'nt too busy
    let isDateAvailable = await ordersDao.checkIfDateAvailable(deliveryDate, theDayAfter);
    
    // if more than 2 orders throw new server error
    if (isDateAvailable["COUNT (ID)"] > 2){
        throw new ServerError(ErrorType.DATE_NOT_AVAILABLE);
    }
}

// check that user didn't bypassed the client limitations and gave bad values
const validateOrderDetails = async(request) =>{
    const city = request.body.city.trim();
    const street = request.body.street.trim();
    const creditCard = request.body.creditCard;
    const deliveryDate = new Date (request.body.deliveryDate);  

    // min date is only tommorrow
    let minDate = await setMinimumDate();

    // validate order details
    // if anything exceeds the restrictions throw new ServerError
    if (deliveryDate < minDate ||
        street.length < 3 || street.length > 15 ||
        city.length < 3 || city.length > 15 ||
        /^\d+$/.test(creditCard) == false ||
        creditCard.length < 8 || creditCard.length > 20){
        throw new ServerError(ErrorType.WRONG_ORDERS_VALUES); 
    }
}

// set min date to delivery (tomorrow)
const setMinimumDate = async () =>{    
    minDate = new Date();
    
    // minimum date is one at least from tomorrow
    minDate.setDate(minDate.getDate() + 1);

    // remove hours from date because
    minDate.setHours(0,0,0,0);
    
    return minDate;
}

module.exports = {
    isFirstOrder,
    getOrdersAmount,
    orderUserCart
}