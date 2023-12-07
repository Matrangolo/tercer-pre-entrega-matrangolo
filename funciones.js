//mostrar alerta de agregar carrito
function mostrarAlerta() {
    const alerta = document.getElementById('alerta');
    alerta.style.display = 'block';
    setTimeout(() => {
        alerta.style.display = 'none';
    }, 1000);
}

//productos de la tienda (producto 1 principal- 2secundaria- 3 alternativa)
const productosDisponibles = [
    { producto: "Producto 1", precio: 29000 },
    { producto: "Producto 2", precio: 29000 },
    { producto: "Producto 3", precio: 35000 }
];

//evento click al comprar
const agregarCarrito = document.querySelectorAll('[id^="add-product"]');
const carritoCompras = document.getElementById('carrito-compras');
const totalDeCompra = document.getElementById('totalDeCompra');
let total = 0;

agregarCarrito.forEach(button => {
    //para cada boton comprar----
    button.addEventListener('click', e => {
        //ID del producto a partir de ID de comprar
        const productId = e.target.id.split('-')[2];
        const selectedProduct = productosDisponibles[productId - 1];

        //(REVISAR ANTES DE ENTREGAR) crea el li para el producto que elegimos
        const li = document.createElement('li');
        li.textContent = `${selectedProduct.producto} - $${selectedProduct.precio}`;

        // boton eliminar dentro de las compras
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('btn', 'btn-danger', 'ml-2');

        //evento click eliminar
        deleteButton.addEventListener('click', () => {
            total -= selectedProduct.precio;
            totalDeCompra.textContent = total;
            li.remove();
            actualizarLocalStorage(); //almacena cuando eliminamos el producto (lo actualiza-revisar antes de entregar)
            console.log(`Producto eliminado: ${selectedProduct.producto}`);
        });

        li.appendChild(deleteButton);
        carritoCompras.appendChild(li);

        //actualizamos el total y la alerta
        total += selectedProduct.precio;
        totalDeCompra.textContent = total;
        mostrarAlerta();
        actualizarLocalStorage(); //actualiza el almacenamiento 
        console.log(`Producto agregado: ${selectedProduct.producto}`);
    });
});

//evento click pagar (ver html por las dudas de que este mal ubicado)
document.getElementById('checkout').addEventListener('click', () => {
    //evento eliominar del carrito
    const selectedItems = carritoCompras.querySelectorAll('li');
    selectedItems.forEach(item => {
        item.addEventListener('click', () => {
            const itemPrice = parseInt(item.textContent.split('$')[1]);
            total -= itemPrice;
            totalDeCompra.textContent = total;
            item.remove();
            actualizarLocalStorage(); // actualizar almacenamiento por eliminacion (REVISAR)
            console.log(`Producto eliminado: ${item.textContent.split(' - ')[0]}`);
        });
    });

    console.log(`Total: $${total}`);
});

// mostrar/ocultar ver compras 
document.getElementById('toggle-cart').addEventListener('click', function mostrarOcultarCarrito() {
    const cartContainer = document.getElementById('carrito-container');
    cartContainer.classList.toggle('d-none');
});

//actualizar carrito de compras
function actualizarLocalStorage() {
    const itemsCarrito = [];
    carritoCompras.querySelectorAll('li').forEach(item => {
        const itemInfo = item.textContent.split(' - $');
        itemsCarrito.push({ producto: itemInfo[0], precio: parseInt(itemInfo[1]) });
    });
    localStorage.setItem('carrito', JSON.stringify(itemsCarrito));
}

//cargar los productos al reiniciar
window.addEventListener('load', () => {
    const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
    carritoActual.forEach(item => {
        //crea elementos y boton en el carrito
        const li = document.createElement('li');
        li.textContent = `${item.producto} - $${item.precio}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('btn', 'btn-danger', 'ml-2');

        //eventos del boton eliminar
        deleteButton.addEventListener('click', () => {
            total -= item.precio;
            totalDeCompra.textContent = total;
            li.remove();
            actualizarLocalStorage(); //almacenamiento del producto al eliminar (revisar)
            console.log(`Producto eliminado: ${item.producto}`);
        });

        li.appendChild(deleteButton);
        carritoCompras.appendChild(li);
        total += item.precio;
        totalDeCompra.textContent = total;
    });
});
