const productsDao = require("../dao/productsDao");
const userUtils = require("../utilities/userUtils");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");


const getProductsAmount = async () =>{
    // callback for ProductsDao > get amount of products function
    const sqlResult = await productsDao.getProductsAmount();
    productsAmount = sqlResult[0]

    // return Products amount back to Products controller
    return productsAmount;
}


// get allProducts from DB
const getAllProducts = async (request) => {

    // callback for ProductsDao > get all products function
    const allProducts = await productsDao.getAllProducts();

    // need to attach for each pic the url
    const hostUrl = "https://adarmarket.onrender.com/";

    // loop through products array and attach host url to picture for each one
    for (product of allProducts) {
        product.picture = hostUrl + product.picture;
    }

    // return all Products back to Products controller
    return allProducts;
}



// ****************************************************************************
// ****************************  ADMIN FUNCTIONS  *****************************
// ****************************************************************************

// get allCategories from DB
const getAllCategories = async (request) => {
    await userUtils.validateIfAdmin(request);

    // callback for ProductsDao > get all Categories function
    const allCategories = await productsDao.getAllCategories();

    // return all Categories back to Products controller
    return allCategories;
}

// update product
const updateProduct = async (request) => {
    await userUtils.validateIfAdmin(request);
    let product = request.body;

    const hostUrl = "https://adarmarket.onrender.com/";
    product.picture = product.picture.slice(hostUrl.length, product.picture.length);

    // validate if admin bypassed client's restrictions.
    // i wasn't sure if its neccessery so i made it anyway 
    await validateProductDetails(product);

    // callback for ProductsDao > editProduct function
    await productsDao.editProduct(product);
}


// update product
const addNewProduct = async (request) => {
    await userUtils.validateIfAdmin(request);

    let product = request.body;

    const hostUrl = "https://adarmarket.onrender.com/";
    product.picture = product.picture.slice(hostUrl.length, product.picture.length);

    // validate if admin bypassed client's restrictions.
    // i wasn't sure if its neccessery so i made it anyway 
    await validateProductDetails(product);

    // callback for ProductsDao > add product function
    const insertResult = await productsDao.addNewProduct(product);

    // return insert id that will give the product its ID
    return insertResult.insertId;
}

// validate if admin bypassed client's restrictions.
// i wasn't sure if its neccessery so i made it anyway although its not too restricting
const validateProductDetails = async (product) =>{
    if (product.name.length < 3 || product.name.length > 20 || 
        product.category.length < 1 || 
        product.picture.length < 1 || product.price < 0.1){
        throw new ServerError(ErrorType.WRONG_FIELD_LENGTHS);
    }

}


module.exports = {
    getAllProducts,
    getProductsAmount,
    getAllCategories,
    updateProduct,
    addNewProduct
}