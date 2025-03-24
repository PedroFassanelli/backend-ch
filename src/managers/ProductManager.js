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
            console.error("❌ Error leyendo productos:", error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getAllProducts();
            return products.find(p => p.id === parseInt(id));
        } catch (error) {
            console.error("❌ Error obteniendo producto:", error);
            throw error;
        }
    }

    async addProduct(product) {
        try {
            const products = await this.getAllProducts();
            const lastId = products.length > 0 ? parseInt(products[products.length - 1].id) : 0;
            const newProduct = { id: lastId + 1, ...product };
            products.push(newProduct);
            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
            return newProduct;
        } catch (error) {
            console.error("❌ Error agregando producto:", error);
            throw error;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const products = await this.getAllProducts();
            const index = products.findIndex(p => p.id === parseInt(id));
            if (index === -1) return null;
            products[index] = { ...products[index], ...updatedFields };
            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
            return products[index];
        } catch (error) {
            console.error("❌ Error actualizando producto:", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getAllProducts();
            const updated = products.filter(p => p.id !== parseInt(id));
            if (updated.length === products.length) return false;
            await fs.writeFile(this.filePath, JSON.stringify(updated, null, 2));
            return true;
        } catch (error) {
            console.error("❌ Error eliminando producto:", error);
            throw error;
        }
    }
}

module.exports = ProductManager;