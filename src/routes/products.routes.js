const express = require("express");
const ProductManager = require("../managers/ProductManager");

const router = express.Router();
const productManager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos." });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        if (!product) return res.status(404).json({ error: "Producto no encontrado." });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto." });
    }
});

router.post("/", async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el producto." });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
        if (!updatedProduct) return res.status(404).json({ error: "Producto no encontrado." });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto." });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const success = await productManager.deleteProduct(req.params.pid);
        if (!success) return res.status(404).json({ error: "Producto no encontrado." });
        res.json({ message: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto." });
    }
});

module.exports = router;