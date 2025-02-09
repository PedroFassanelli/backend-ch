const express = require("express");
const ProductManager = require("./ProductManager");
const CartManager = require("./CartManager");

const app = express();
const PORT = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Instancias de los managers
const productManager = new ProductManager('./products.json');
const cartManager = new CartManager('./carts.json');

// Rutas para productos
const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
    const products = await productManager.getAllProducts();
    res.json(products);
});

productsRouter.get('/:pid', async (req, res) => {
    const product = await productManager.getProductById(req.params.pid);
    if (product) res.json(product);
    else res.status(404).json({ error: 'Producto no encontrado' });
});

productsRouter.post('/', async (req, res) => {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
});

productsRouter.put('/:pid', async (req, res) => {
    const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
    if (updatedProduct) res.json(updatedProduct);
    else res.status(404).json({ error: 'Producto no encontrado' });
});

productsRouter.delete('/:pid', async (req, res) => {
    const success = await productManager.deleteProduct(req.params.pid);
    if (success) res.json({ message: 'Producto eliminado' });
    else res.status(404).json({ error: 'Producto no encontrado' });
});

// Rutas para carritos
const cartsRouter = express.Router();

cartsRouter.post('/', async (req, res) => {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
});

cartsRouter.get('/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid);
    if (cart) res.json(cart);
    else res.status(404).json({ error: 'Carrito no encontrado' });
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
    if (updatedCart) res.json(updatedCart);
    else res.status(404).json({ error: 'Carrito o producto no encontrado' });
});

// Configurar routers en la app principal
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});