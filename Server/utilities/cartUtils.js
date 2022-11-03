const cartDao = require("../dao/cartDao");

// this function placed in utils because it is accessed from orders and cart requests
const getUserCart = async (userId) =>{
    // check if user have cart
    let userCart = await cartDao.getUserCart(userId);

    const hostUrl = "https://adarmarket.onrender.com/";
    
    
    if (userCart.length > 0){
        // loop through cart array and attach host url to picture for each one
        for (product of userCart) {
            product.picture = hostUrl + product.picture;
        }

        return userCart;
    }
    return false;
}


module.exports = {
    getUserCart
}