const fs = require("fs").promises;

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async getAllCarts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async createCart() {
        const carts = await this.getAllCarts();
        const lastId = carts.length > 0 ? parseInt(carts[carts.length - 1].id) : 0;
        const newId = lastId + 1;
        const newCart = { id: newId, products: [] };
        carts.push(newCart);
        await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.getAllCarts();
        return carts.find(cart => cart.id === parseInt(id));
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getAllCarts();
        const cartIndex = carts.findIndex(cart => cart.id === parseInt(cartId));
        if (cartIndex === -1) return null;

        let cart = carts[cartIndex];
        const productIndex = cart.products.findIndex(p => p.product === parseInt(productId));
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: parseInt(productId), quantity: 1 });
        }

        await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
        return cart;
    }
}

module.exports = CartManager;