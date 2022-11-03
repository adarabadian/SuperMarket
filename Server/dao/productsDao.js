const connection = require("./connection-wrapper");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");

const getAllProducts = async () => {
    const SQL = `SELECT 
    p.ID AS id,
    p.Name AS name,
    c.Name AS category,
    p.Picture AS picture,
    p.Price AS price
    
    FROM products p

    inner join categories c on c.ID = p.Category_ID`

    try {
        const allProducts= await connection.execute(SQL);
        return allProducts;
    }

    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }
}


const getProductsAmount = async () => {
    const SQL = `SELECT COUNT(ID)
    FROM products`

    try {
        const productsNumber= await connection.execute(SQL);
        return productsNumber;
    }

    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }
}

const getAllCategories = async () => {
    const SQL = `SELECT *
    FROM categories`

    try {
        const allCategories= await connection.execute(SQL);
        return allCategories;
    }

    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }
}


let editProduct = async (product)=>{

    let SQL = `UPDATE products
    SET Category_ID = ?, Name = ?, Picture = ?, Price = ?
    WHERE ID = ?;`;

    let parameters = [
        product.category,
        product.name,
        product.picture,
        product.price,
        product.id
    ];
    
    try {
        await connection.executeWithParameters(SQL, parameters);
    }

    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }

}


let addNewProduct = async (product)=>{

    let SQL = `INSERT INTO products (Category_ID, Name, Picture, Price)
    VALUES (?, ?, ?, ?)`;

    let parameters = [
        product.category,
        product.name,
        product.picture,
        product.price,
    ];
    
    try {
         return await connection.executeWithParameters(SQL, parameters);
    }

    catch(error){
        throw new ServerError(ErrorType.GENERAL_ERROR, SQL, error);
    }

}


module.exports = {
    getAllProducts,
    getProductsAmount,
    getAllCategories,
    editProduct,
    addNewProduct
};