const connection = require("./connection-wrapper");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");

// function that checks if username already exists
let isUserExists = async (id, email) => {
    const SQL = `SELECT ID As id, Email AS email FROM users WHERE ID =? OR Email =?`;
    let parameters = [
        id,
        email
    ];

    try {
        let isExist = await connection.executeWithParameters(SQL, parameters);
        return isExist;
    }

    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }
}


// login function
let login = async (email, hashedPassword) => {
    
    const SQL = `SELECT First_Name AS firstName,
    User_Type as userType,
    ID as id
    FROM users 
    WHERE Email =? and Password =?`;
    let parameters = [
        email,
        hashedPassword
    ];
    
    try {
        let userLoginResult = await connection.executeWithParameters(SQL, parameters);
        return userLoginResult[0];
    }

    catch(error){
        throw new error;
    }
}


let register = async (userData) => {
    let SQL = "INSERT into users (ID, Email, Password, City, Street, First_Name, Last_Name) VALUES (?, ?, ?, ?, ?, ?, ?)" 
    let parameters = [
        userData.id,
        userData.email,
        userData.password,
        userData.city,
        userData.street,
        userData.firstName,
        userData.lastName
    ];
    
    try {
        let executionResult = await connection.executeWithParameters(SQL, parameters);
        return(executionResult);
    }

    catch(error){
        throw new error;
    }
}


let getUserAddress = async (userId) => {
    let SQL = "SELECT City, Street FROM users WHERE ID = (?)" 
    
    let parameters = [
        userId
    ];
    
    try {
        let executionResult = await connection.executeWithParameters(SQL, parameters);
        return(executionResult);
    }

    catch(error){
        throw new error;
    }
}


module.exports = {
    login,
    register,
    isUserExists,
    getUserAddress
};