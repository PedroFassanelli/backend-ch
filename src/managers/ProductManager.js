const fs = require("fs").promises;
const path = require("path");

class ProductManager {
    constructor(filePath) {
        this.filePath = path.resolve(filePath);
    }

    async getAllProducts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getAllProducts();
        return products.find(prod => prod.id === parseInt(id));
    }

    async addProduct(product) {
        const products = await this.getAllProducts();
        const lastId = products.length > 0 ? parseInt(products[products.length - 1].id) : 0;
        const newId = lastId + 1;
        const newProduct = { id: newId, ...product };
        products.push(newProduct);
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async updateProduct(id, updatedFields) {
        let products = await this.getAllProducts();
        const index = products.findIndex(prod => prod.id === parseInt(id));
        if (index === -1) return null;
        products[index] = { ...products[index], ...updatedFields };
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
        return products[index];
    }

    async deleteProduct(id) {
        let products = await this.getAllProducts();
        const newProducts = products.filter(prod => prod.id !== parseInt(id));
        if (products.length === newProducts.length) return false;
        await fs.writeFile(this.filePath, JSON.stringify(newProducts, null, 2));
        return true;
    }
}

module.exports = ProductManager;