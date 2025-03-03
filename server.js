const express = require("express");
const productsRouter = require("./src/routes/products.routes");
const cartsRouter = require("./src/routes/carts.routes");

const app = express();
const PORT = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar routers en la app principal
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});