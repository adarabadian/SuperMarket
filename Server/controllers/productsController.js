const express = require("express");
const router = express.Router();
const productsLogic = require("../logic/productsLogic");
// MULTER
const multer = require('multer');
const fs = require('fs');


router.get("/", async (request, response, next) => {
    try {
        const allProducts = await productsLogic.getAllProducts(request);
        // return all products
        response.json(allProducts);
    }
    catch (error) {
        next(error);
    }
});

router.get("/getProductsAmount", async (request, response, next) => {
    try {
        const productsAmount = await productsLogic.getProductsAmount(request);
        // return productsAmount
        response.json(productsAmount);
    }
    catch (error) {
        next(error);
    }
});

router.get("/getAllCategories", async (request, response, next) => {
    try {
        const categories = await productsLogic.getAllCategories(request);
        
        // return productsAmount
        response.json(categories);
    }
    catch (error) {
        next(error);
    }
});

router.put("/", async (request, response, next) => {
    try {
        await productsLogic.updateProduct(request);
         
        response.json();
    }
    catch (error) {
        next(error);
    }
});

router.post("/", async (request, response, next) => {
    try {
        let productId = await productsLogic.addNewProduct(request);
         
        // return productID
        response.json(productId);
    }
    catch (error) {
        next(error);
    }
});


// MULTER
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
})
let upload = multer({ storage: storage }).single('file');

// multer upload pic function
router.post('/uploadPicture', function (request, response) {
    upload(request, response, function (error) {
        const hostUrl = "https://adarmarket.onrender.com/";

        if (error instanceof multer.MulterError) {
            console.log(error);
            return;
        } 
        else if (error) {
            console.log(error);
            return;
        }

        // if there's a picture to delete - delete it
        if (request.body.fileToDelete != '/assets/noPicture.png') {
            request.body.fileToDelete = request.body.fileToDelete.slice(hostUrl.length,request.body.fileToDelete.length);
            deletePicture(request.body.fileToDelete);
        }

        if(request.file.filename != undefined){
            request.file.filename = hostUrl + request.file.filename;
        }
        
        return response.status(200).send(request.file);
    })
});


//Multer Delete function
async function deletePicture (pictureForDelete) {
    fs.unlinkSync("./uploads/" + pictureForDelete);
    console.log("File deleted");
}

module.exports = router;