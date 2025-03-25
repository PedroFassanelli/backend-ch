const express = require("express");
const router = express.Router();
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");

// Vista de productos paginados
router.get("/products", async (req, res) => {
    const { limit = 5, page = 1 } = req.query;
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      lean: true
    };
  
    const result = await Product.paginate({}, options);
    res.render("home", {
      products: result.docs,
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage
    });
});

// Detalle de producto
router.get("/products/:pid", async (req, res) => {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).send("Producto no encontrado");
    res.render("productDetail", product);
  });

// Vista del carrito
router.get("/carts/:cid", async (req, res) => {
    const cart = await Cart.findById(req.params.cid).populate("products.product").lean();
    if (!cart) return res.status(404).send("Carrito no encontrado");
    res.render("cartDetail", { cart });
  });

module.exports = router;