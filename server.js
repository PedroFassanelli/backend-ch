const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { engine } = require("express-handlebars");
const path = require("path");
const cookieParser = require("cookie-parser");
const Cart = require("./src/models/cart.model"); 

const productsRouter = require("./src/routes/products.routes");
const cartsRouter = require("./src/routes/carts.routes");
const viewsRouter = require("./src/routes/views.routes");
const ProductManager = require("./src/managers/ProductManager");

const connectDB = require("./src/config/db");
connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer); 
const PORT = 8080;

const productManager = new ProductManager("./src/data/products.json");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware para asignar carrito automáticamente
app.use(async (req, res, next) => {
    let cartId = req.cookies.cartId;
  
    if (!cartId) {
      const newCart = await Cart.create({ products: [] });
      cartId = newCart._id.toString();
      res.cookie("cartId", cartId, { maxAge: 1000 * 60 * 60 * 24 * 7 }); // 7 días
    }
  
    // Hacer el ID disponible para las vistas
    res.locals.cartId = cartId;
  
    next();
  });

// Configuración de Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/src/views"));

// Archivos estáticos
app.use(express.static(path.join(__dirname, "/src/public")));

// Configurar routers en la app principal
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use("/", viewsRouter);

// WebSockets
io.on("connection", async (socket) => {
    console.log("🟢 Cliente conectado");

    const products = await productManager.getAllProducts();
    socket.emit("updateProducts", products);

    socket.on("newProduct", async (product) => {
        await productManager.addProduct(product);
        const updatedProducts = await productManager.getAllProducts();
        io.emit("updateProducts", updatedProducts);
    });

    socket.on("deleteProduct", async (productId) => {
        await productManager.deleteProduct(productId);
        const updatedProducts = await productManager.getAllProducts();
        io.emit("updateProducts", updatedProducts);
    });

    socket.on("disconnect", () => {
        console.log("🔴 Cliente desconectado");
    });
});

httpServer.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});