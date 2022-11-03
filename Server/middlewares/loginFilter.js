const expressJwt = require("express-jwt");
const config = require("../config.json");

let { secret } = config;

function authenticationJwtRequestToken() {
    return expressJwt({ secret, algorithms: ["HS256"] }).unless({
        path: [
            "/users",
            "/users/isUserExists",
            "/users/login",
            "/users/logUserWithToken",
            "/products/getProductsAmount",
            "/orders/getOrdersAmount",

            // "/products"
        ]
    })
}
module.exports = authenticationJwtRequestToken;