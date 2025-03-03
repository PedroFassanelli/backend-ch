const socket = io();

// Capturar elementos del DOM
const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");
const deleteBtn = document.getElementById("deleteBtn");
const deleteId = document.getElementById("deleteId");

// Escuchar actualización de productos desde el servidor
socket.on("updateProducts", (products) => {
    productList.innerHTML = "";
    products.forEach((product) => {
        const li = document.createElement("li");
        li.textContent = `${product.id} - ${product.title} - $${product.price}`;
        productList.appendChild(li);
    });
});

// Enviar un nuevo producto
productForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    
    if (title && price) {
        socket.emit("newProduct", { title, price: parseFloat(price) });
        productForm.reset();
    }
});

// Enviar solicitud para eliminar producto
deleteBtn.addEventListener("click", () => {
    const productId = deleteId.value;
    if (productId) {
        socket.emit("deleteProduct", parseInt(productId));
        deleteId.value = "";
    }
});