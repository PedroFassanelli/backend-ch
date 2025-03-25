const express = require("express");
const router = express.Router();
const Cart = require('../models/cart.model');

// Crear nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await Cart.create({ products: [] });
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

// Obtener carrito con populate
router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

// Agregar producto a carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        const existing = cart.products.find(p => p.product.toString() === req.params.pid);
        if (existing) {
            existing.quantity++;
        } else {
            cart.products.push({ product: req.params.pid, quantity: 1 });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

// DELETE: eliminar producto específico
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        cart.products = cart.products.filter(p => p.product.toString() !== req.params.pid);
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }
});

// PUT: reemplazar todos los productos
router.put('/:cid', async (req, res) => {
    try {
        const { products } = req.body;
        const cart = await Cart.findByIdAndUpdate(req.params.cid, { products }, { new: true });
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
});

// PUT: actualizar cantidad de un producto
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        const product = cart.products.find(p => p.product.toString() === req.params.pid);
        if (!product) return res.status(404).json({ error: 'Producto no encontrado en el carrito' });

        product.quantity = quantity;
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar cantidad' });
    }
});

// DELETE: vaciar carrito
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        cart.products = [];
        await cart.save();

        res.json({ message: 'Carrito vaciado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al vaciar carrito' });
    }
});

module.exports = router;