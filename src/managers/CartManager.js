const fs = require("fs").promises;
const path = require("path");

class CartManager {
    constructor(filePath) {
        this.filePath = path.resolve(filePath);
    }

    async getAllCarts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error("❌ Error leyendo carritos:", error);
            return [];
        }
    }

    async createCart() {
        try {
            const carts = await this.getAllCarts();
            const lastId = carts.length > 0 ? parseInt(carts[carts.length - 1].id) : 0;
            const newCart = { id: lastId + 1, products: [] };
            carts.push(newCart);
            await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
            return newCart;
        } catch (error) {
            console.error("❌ Error creando carrito:", error);
            throw error;
        }
    }

    async getCartById(id) {
        try {
            const carts = await this.getAllCarts();
            return carts.find(cart => cart.id === parseInt(id));
        } catch (error) {
            console.error("❌ Error obteniendo carrito:", error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const carts = await this.getAllCarts();
            const cartIndex = carts.findIndex(c => c.id === parseInt(cartId));
            if (cartIndex === -1) return null;

            const cart = carts[cartIndex];
            const prodIndex = cart.products.findIndex(p => p.product === parseInt(productId));

            if (prodIndex !== -1) {
                cart.products[prodIndex].quantity += 1;
            } else {
                cart.products.push({ product: parseInt(productId), quantity: 1 });
            }

            await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
            return cart;
        } catch (error) {
            console.error("❌ Error agregando producto al carrito:", error);
            throw error;
        }
    }
}

module.exports = CartManager;