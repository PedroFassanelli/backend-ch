const express = require("express");
const router = express.Router();
const ProductManager = require("../managers/ProductManager");

const productManager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.render("home", { products });
    } catch (error) {
        res.status(500).send("Error al cargar la vista principal");
    }
});

router.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.render("realTimeProducts", { products });
    } catch (error) {
        res.status(500).send("Error al cargar la vista en tiempo real");
    }
});

module.exports = router;