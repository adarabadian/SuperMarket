const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const usersDao = require("../dao/usersDao");
const usersServerCache = require("../models/usersServerCache");
const config = require ("../config.json");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");
const userUtils = require("../utilities/userUtils");


const login = async(userData, isLoginAfterRegistration) =>  {
    // hash the password only in case of normal login, if just registered then dont hash.
    if (!isLoginAfterRegistration){
        validateUserParmLengths(userData, false);

        userData.password = createHashPassword(userData.password);
    }
    
    // callback to dao login function
    let successfullLoginData = await usersDao.login(userData.email, userData.password);
    
    if (successfullLoginData == undefined){
        throw new ServerError(ErrorType.WRONG_EMAIL_OR_PASSWORD);
    }

    // if usersDao succeeded then start creating token for the user
    let saltedEmail = "ii4msat" + successfullLoginData.email + "77DopeE";

    // creating token from salted username
    let token = jwt.sign({sub:saltedEmail}, config.secret);

    // create user cache to save on server cache
    let userCachedData = {
        userType: successfullLoginData.userType,
        email: userData.email,
        firstName: successfullLoginData.firstName,
        userId: successfullLoginData.id,
    }
    
    // save the user's token and data at server's cache to reach it faster than from DB
    usersServerCache.set(token, userCachedData);

    // create login response to send to the client
    let successfullLoginResponse = {
        token: token,
        userType: successfullLoginData.userType,
        firstName: successfullLoginData.firstName
    }
    
    // return successfull login response to usersController
    return successfullLoginResponse;
};


const register = async (userRegistrationDetails) => {
    validateUserParmLengths(userRegistrationDetails, true);

    // if ID / Email exists return
    let isExist = await usersDao.isUserExists(userRegistrationDetails.id, userRegistrationDetails.email);
    if (isExist.length !== 0){
     throw new ServerError(ErrorType.USER_ALREADY_EXISTS);
    }

    let hashedPassword = createHashPassword(userRegistrationDetails.password);

    // replace user's password with hashed password
    userRegistrationDetails.password = hashedPassword;

    // callback to usersDao register function and wait for response
    await usersDao.register(userRegistrationDetails);

    // if register succeeded then log the user in with login function
    let loginDetails = {
        email: userRegistrationDetails.email,
        password: hashedPassword
    }

    // login the user
    let successfullLoginResponse = await login(loginDetails, true);

    return successfullLoginResponse;
}


// hashing password
const createHashPassword = (password) => {
    let saltedPassword = "a36w5gr%wA($oaj" + password + "(&#DE5JS4#%$@";
    let hashedPassword = crypto.createHash("md5").update(saltedPassword).digest("hex");

    return hashedPassword;
}

const validateUserParmLengths= (user, isRegister) =>{
    const citys  = ["Tel Aviv", "Jerusalem", "Azor", "Haifa", "Holon",
        "Beer Sheva",  "Eliat",  "Ramat Gan", "Dimona", "Kfar Saba"
      ];

    if (!isUserEmailValid(user.email)){
        throw new ServerError(ErrorType.WRONG_FIELD_LENGTHS);
    }

    // in case its after register needs to validate city, street, userId, firstName & lastName as well 
    if (isRegister){
        if (user.id < 10000000 || user.id > 999999999 ||
            !citys.includes(user.city) || !isUserPasswordValid(user.password) ||
            user.street.trim().length < 4 || user.street.trim().length > 20 ||
            user.firstName.trim().length < 3 || user.firstName.trim().length > 12 ||
            user.lastName.trim().length < 3 || user.lastName.trim().length > 12){
            throw new ServerError(ErrorType.WRONG_FIELD_LENGTHS);
        }
    }
}

// validates email pattern
const isUserEmailValid = (email) =>{
    return (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
}

// validates password pattern
const isUserPasswordValid = (password) =>{
    return  /(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{6,12}/.test(password);
}

const isUserExists = async (userDetails) =>{
    let id = userDetails.id;
    let email = userDetails.email;

    // if ID / Email exists return
    let isExist = await usersDao.isUserExists(id, email);

    if (isExist.length !== 0){
     throw new ServerError(ErrorType.USER_ALREADY_EXISTS);
    }
    return;
}


const logOutUser = async (request) =>{
    // log out user by deleting its token from server's cache
    const authorizationString = request.headers["authorization"];
    const token = authorizationString.substring("Bearer ".length);

    usersServerCache.delete(token);
}


const loginWithToken = async (request) =>{
    const authorizationString = request.headers["authorization"];
    const token = authorizationString.substring("Bearer ".length);
    
    let successfullLoginResponse = usersServerCache.get(token);

    return successfullLoginResponse;
}


const getUserAddress = async (request) =>{
    let userId = await userUtils.getUserId(request);
    
    // search user address in sql
    let userAddress = await usersDao.getUserAddress(userId);
    userAddress = userAddress[0];
    return userAddress;
}

module.exports = {
    login, 
    register,
    logOutUser,
    loginWithToken,
    isUserExists,
    getUserAddress
};
