const connection = require("./connection-wrapper");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");

let getUserCart = async (userId) => {
    const SQL = `SELECT 
    cart.ID AS cartId,
    cart_item.Product_ID AS productId,
    products.Name AS name,
    products.Category_ID AS category,
    products.Price AS price,
    products.Picture AS picture,
    cart_item.Amount AS amount,
    cart_item.Total_Price AS totalPrice
    
    FROM carts cart

    INNER JOIN cart_item cart_item ON cart_item.Cart_ID = cart.ID
    INNER JOIN products products ON cart_item.Product_ID = products.ID

    WHERE cart.Customer_ID = (?) AND cart.Is_Open = 1`


    let parameters = [
        userId
    ];

    try {
        let executionResult = await connection.executeWithParameters(SQL, parameters);
        
        return(executionResult);
    }

    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }
}


let getUserCartId = async (customerId) =>{
    const SQL = `SELECT ID  FROM carts
    WHERE Customer_ID = (?) AND Is_Open = 1;`

    let parameters = [
        customerId
    ];

    try {
        let executionResult = await connection.executeWithParameters(SQL, parameters);
        return(executionResult);
    }

    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }
}


let createNewCart = async (customerId, creationDate) => {
    const SQL = `INSERT into carts (Customer_ID, Creation_Date) VALUES (?, ?);`

    let parameters = [
        customerId,
        creationDate
    ];

    try {
        await connection.executeWithParameters(SQL, parameters);
    }

    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }
}

let closeUserCart = async (userId) => {
    const SQL = `UPDATE carts
    SET Is_Open = 0
    WHERE Customer_ID = (?) AND Is_Open = 1;`

    let parameters = [
        userId
    ];

    try {
        return await connection.executeWithParameters(SQL, parameters);
    }

    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }
}


let addProductToCart = async (productId, productAmount, totalPrice, userCartId) => {
    const SQL = `INSERT INTO cart_item (Product_ID, Amount, Total_Price, Cart_ID) VALUES (?, ?, ?, ?);`

    let parameters = [
        productId,
        productAmount,
        totalPrice,
        userCartId
    ];

    try {
        await connection.executeWithParameters(SQL, parameters);
    }

    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }
}

let updateProductAmount = async (productId, productAmount, totalPrice, userCartId) => {
    const SQL = `UPDATE cart_item 
    SET Amount = (?), Total_Price = (?)
    WHERE Product_ID = (?) AND Cart_ID = (?);`

    let parameters = [
        productAmount,
        totalPrice,
        productId,
        userCartId
    ];

    try {
        await connection.executeWithParameters(SQL, parameters);
    }

    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }
}

let getProductUnitPrice = async (productId) => {
    const SQL = `SELECT Price FROM products WHERE ID = (?);`

    let parameters = [
        productId
    ];

    try {
        return await connection.executeWithParameters(SQL, parameters);
    }

    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }
}

let deleteProductFromCart = async (productId, cartId) => {
    const SQL = `DELETE FROM cart_item WHERE Product_ID = (?) AND Cart_ID = (?);`

    let parameters = [
        productId,
        cartId
    ];

    try {
        await connection.executeWithParameters(SQL, parameters);
    }

    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }
}


let emptyUserCart = async (cartId) => {
    const SQL = `DELETE FROM cart_item WHERE Cart_ID = (?);`

    let parameters = [
        cartId
    ];

    try {
        await connection.executeWithParameters(SQL, parameters);
    }

    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }
}

module.exports = {
    getUserCart,
    createNewCart,
    addProductToCart,
    getProductUnitPrice,
    getUserCartId,
    updateProductAmount,
    deleteProductFromCart,
    emptyUserCart,
    closeUserCart
};