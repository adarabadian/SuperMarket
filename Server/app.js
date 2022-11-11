const express = require("express");
const errorHandler = require("./errors/errorHandler");
const usersController = require("./controllers/usersController");
const productsController = require("./controllers/productsController");
const ordersController = require("./controllers/ordersController");
const cartController = require("./controllers/cartController");
const loginFilter = require("./middlewares/loginFilter");
const cors = require("cors");
const server = express();;
const path = require('path');

const port = process.env.PORT || 3000;

server.use(express.static(path.join(__dirname, './dist/client')));


server.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, './dist/client/index.html'));
});

server.get('/login', (req,res) => {
    res.redirect('https://adarmarket.onrender.com/');
});

server.get('/admin', (req,res) => {
    res.redirect('https://adarmarket.onrender.com/');
});

server.get('/register', (req,res) => {
    res.redirect('https://adarmarket.onrender.com/');
});

server.get('/advanced-register', (req,res) => {
    res.redirect('https://adarmarket.onrender.com/');
});

server.get('/customer', (req,res) => {
    res.redirect('https://adarmarket.onrender.com/');
});

server.get('/allproducts', (req,res) => {
    res.redirect('https://adarmarket.onrender.com/');
});

server.get('/checkout', (req,res) => {
    res.redirect('https://adarmarket.onrender.com/');
});

server.get('/checkout-complete', (req,res) => {
    res.redirect('https://adarmarket.onrender.com/');
});

server.use(cors());

server.use(express.static('./uploads'));
server.use(express.json());
server.use(loginFilter());


server.use("/users", usersController);
server.use("/products", productsController);
server.use("/orders", ordersController);
server.use("/cart", cartController);

server.use(errorHandler);


server.listen(port, () => console.log("listening on port " + port));

server.use(cors({ origin: "https://adarmarket.onrender.com", credentials: false }));
server.use(cors({ origin: "http://adarmarket.onrender.com", credentials: false }));
server.use(cors({ origin: 'http://adar-projects-catalog.onrender.com', credentials: false }));
server.use(cors({ origin: 'https://adar-projects-catalog.onrender.com', credentials: false }));
server.use(cors({ origin: 'https://adar-projects-catalog.herokuapp.com', credentials: false }));
server.use(cors({ origin: 'http://adar-projects-catalog.herokuapp.com', credentials: false }));