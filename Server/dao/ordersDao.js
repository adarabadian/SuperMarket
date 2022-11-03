const connection = require("./connection-wrapper");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");

const doesUserHaveOrders = async (userId) => {
    const SQL = `SELECT *
    FROM orders
    WHERE Customer_ID=(?)`

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


const getOrdersAmount = async () => {
    const SQL = `SELECT COUNT(ID)
    FROM orders`

    try {
        const ordersNumber= await connection.execute(SQL);
        return ordersNumber;
    }

    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }
}


const orderUserCart = async (orderDetails) => {
    const SQL = `INSERT into orders 
        (Customer_ID, Cart_ID, Total_Price, City, Street, 
        Delivery_Date, Purchase_Date, Credit_Card_End) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);`

    let parameters = [
        orderDetails.userId,
        orderDetails.cartId,
        orderDetails.totalPrice,
        orderDetails.city,
        orderDetails.street,
        orderDetails.deliveryDate,
        orderDetails.purchaseDate,
        orderDetails.creditCard
    ];

    try {
        await connection.executeWithParameters(SQL, parameters);
    }

    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }
}


const checkIfDateAvailable = async (deliveryDate, theDayAfter) => {
    const SQL = `SELECT COUNT (ID)
        FROM orders
        WHERE Delivery_Date BETWEEN (?) AND (?);`

    let parameters = [
        deliveryDate,
        theDayAfter
    ];

    try {
        let result = await connection.executeWithParameters(SQL, parameters);
        return result[0];
    }

    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }
}


module.exports = {
    doesUserHaveOrders,
    getOrdersAmount,
    orderUserCart,
    checkIfDateAvailable
};