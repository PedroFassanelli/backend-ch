const express = require("express");
const Product = require('../models/product.model');
const router = express.Router();

// GET /api/products
router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true, // necesario para usar con Handlebars si querés reutilizar
        };

        // Filtro
        let filter = {};
        if (query) {
            if (query === "available") {
                filter.stock = { $gt: 0 };
            } else if (query === "unavailable") {
                filter.stock = 0;
            } else {
                filter.category = query;
            }
        }

        // Ordenamiento
        if (sort === "asc") {
            options.sort = { price: 1 };
        } else if (sort === "desc") {
            options.sort = { price: -1 };
        }

        const result = await Product.paginate(filter, options); // usaremos paginate

        const { docs, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = result;

        res.json({
            status: "success",
            payload: docs,
            totalPages,
            prevPage,
            nextPage,
            page: result.page,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? `/api/products?page=${prevPage}` : null,
            nextLink: hasNextPage ? `/api/products?page=${nextPage}` : null
        });

    } catch (error) {
        console.error("❌ Error paginando productos:", error);
        res.status(500).json({ error: "Error al obtener productos paginados" });
    }
});

// GET /api/products/:pid
router.get("/:pid", async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) return res.status(404).json({ error: "Producto no encontrado." });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto." });
    }
});

// POST /api/products
router.post("/", async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('❌ Error al crear producto:', error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

// PUT /api/products/:pid
router.put("/:pid", async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: "Producto no encontrado." });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto." });
    }
});

// DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.pid);
        if (!deleted) return res.status(404).json({ error: "Producto no encontrado." });
        res.json({ message: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto." });
    }
});

module.exports = router;