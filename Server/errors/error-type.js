let ErrorType = {
  GENERAL_ERROR: {
    id: 1,
    httpCode: 500,
    message: "A General Error Has Occurred",
    isShowStackTrace: true,
    }
    ,
  USER_ALREADY_EXISTS: {
      id: 2,
      httpCode: 500,
      message: "This ID or Email already exists. If you've already registered please go back to login page",
      isShowStackTrace: true,
  } 
  ,
  WRONG_EMAIL_OR_PASSWORD:{
    id: 3,
    httpCode: 500,
    message: "Wrong email or password.",
    isShowStackTrace: true,
  }
  ,
  INSUFFICIENT_PRIVILEGES:{
    id: 4,
    httpCode: 500,
    message: "You don't have premission to perform this operation.",
    isShowStackTrace: true,
  }
  ,
  WRONG_FIELD_LENGTHS:{
    id: 5,
    httpCode: 500,
    message: "You didn't filled all the parameters with the correct field lengths.",
    isShowStackTrace: true,
  }
  ,
  USER_CART_EMPTY:{
    id: 6,
    httpCode: 500,
    message: "It seems that your user cart is empty, please add products to your cart and try again.",
    isShowStackTrace: true,
  }
  ,
  DATE_NOT_AVAILABLE:{
    id: 7,
    httpCode: 500,
    message: "We're sorry but this date is full of orders, please consider a different date.",
    isShowStackTrace: true,
  }
  ,
  WRONG_ORDERS_VALUES:{
    id: 8,
    httpCode: 500,
    message: "We're sorry but it seems that your order has some data that we couldn't accept, please check again the data that you've inserted and try again.",
    isShowStackTrace: true,
  }
  ,
  PRODUCT_AMOUNT_INVALID:{
    id: 9,
    httpCode: 500,
    message: "It seems that the amount of product you wanted is not accepted by us, please consider another number (from 1 and up to 99).",
    isShowStackTrace: true,
  }
}

module.exports = ErrorType