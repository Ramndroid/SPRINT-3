// If you have time, you can move this variable "products" to a json file and load the data in this js. It will look more professional
var products = [
    {
        id: 1,
        name: 'cooking oil',
        price: 10.5,
        type: 'grocery'
    },
    {
        id: 2,
        name: 'Pasta',
        price: 6.25,
        type: 'grocery'
    },
    {
        id: 3,
        name: 'Instant cupcake mixture',
        price: 5,
        type: 'grocery'
    },
    {
        id: 4,
        name: 'All-in-one',
        price: 260,
        type: 'beauty'
    },
    {
        id: 5,
        name: 'Zero Make-up Kit',
        price: 20.5,
        type: 'beauty'
    },
    {
        id: 6,
        name: 'Lip Tints',
        price: 12.75,
        type: 'beauty'
    },
    {
        id: 7,
        name: 'Lawn Dress',
        price: 15,
        type: 'clothes'
    },
    {
        id: 8,
        name: 'Lawn-Chiffon Combo',
        price: 19.99,
        type: 'clothes'
    },
    {
        id: 9,
        name: 'Toddler Frock',
        price: 9.99,
        type: 'clothes'
    }
]

// Improved version of cartList. Cart is an array of products (objects), but each one has a quantity field to define its quantity, so these products are not repeated.
var cart = [];

var subtotal = {
    grocery: {
        value: 0,
        discount: 0
    },
    beauty: {
        value: 0,
        discount: 0
    },
    clothes: {
        value: 0,
        discount: 0
    },
};
var total = 0;


// APPLY PROMOTIONS CART
function applyPromotionsCart() {
    // Apply promotions to each item in the array "cart"
    cart.forEach(item => {
        switch (item.name) {
            case 'cooking oil':
                if (item.quantity >= 3) {
                    let newCookinOilPrice = 10;
                    item.subtotalWithDiscount = newCookinOilPrice * item.quantity;
                } else {
                    item.subtotalWithDiscount = 0;
                }
                break;

            case 'Instant cupcake mixture':
                if (item.quantity >= 10) {
                    let newMixturePrice = 2 / 3;
                    item.subtotalWithDiscount = item.price * newMixturePrice * item.quantity;
                } else {
                    item.subtotalWithDiscount = 0;
                }
                break;
        }
    });
}

// ADD TO CART
function addToCart(id) {
    // 1. Loop for to the array products to get the item to add to cart
    // 2. Add found product to the cart array or update its quantity in case it has been added previously.
    products.forEach(product => {
        if (product.id === id) {
            if (cart.filter(item => item.id === id).length > 0) {
                cart.forEach(it => {
                    if (it.name === product.name) {
                        it.quantity += 1;
                        it.subtotal = product.price * it.quantity;
                    }
                });
            } else {
                let element = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    type: product.type,
                    quantity: 1,
                    subtotal: product.price,
                    subtotalWithDiscount: 0
                };

                cart.push(element);
            }
        }
    });
}

// CALCULATE SUBTOTAL
function calculateSubtotalsCart() {
    Object.keys(subtotal).forEach(key => {
        subtotal[key].value = 0;
        subtotal[key].discount = 0;
    });

    cart.forEach(product => {
        switch (product.type) {
            case 'grocery':
                subtotal.grocery.value += product.subtotal;
                if (product.subtotalWithDiscount > 0) {
                    subtotal.grocery.discount += product.subtotal - product.subtotalWithDiscount;
                }
                break;

            case 'beauty':
                subtotal.beauty.value += product.subtotal;
                if (product.subtotalWithDiscount > 0) {
                    subtotal.beauty.discount += product.subtotal - product.subtotalWithDiscount;
                }
                break;

            case 'clothes':
                subtotal.clothes.value += product.subtotal;
                if (product.subtotalWithDiscount > 0) {
                    subtotal.clothes.discount += product.subtotal - product.subtotalWithDiscount;
                }
                break;
        }
    });
}

// CALCULATE TOTAL
function calculateTotalCart() {
    total = 0;
    let totalTmp = 0;
    let discountTmp = 0;

    Object.keys(subtotal).forEach(key => {
        totalTmp += subtotal[key].value;
        discountTmp += subtotal[key].discount;
    });

    total = totalTmp - discountTmp;
}

// REMOVE 1 U. FROM CART
function removeFromCart(id) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            if (cart[i].quantity > 1) {
                cart[i].quantity--;
                cart[i].subtotal = cart[i].price * cart[i].quantity;
            } else if (cart[i].quantity == 1) {
                cart.splice(i, 1);
            }
        }
    }

    printCart();
}

// REMOVE ITEMO FROM CART
function removeElementFromCart(id) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart.splice(i, 1);
        }
    }

    printCart();
}

// ADD 1 U. TO CART
function addFromCart(id) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            if (cart[i].quantity >= 1) {
                cart[i].quantity++;
                cart[i].subtotal = cart[i].price * cart[i].quantity;
            }
        }
    }

    printCart();
}

// PRINT CART
function printCart() {
    // Aplicar promociones a 'cart'
    applyPromotionsCart();

    // Calcular subtotales
    calculateSubtotalsCart();

    // Calcular total
    calculateTotalCart();

    let lista = document.getElementById("lista");
    lista.innerHTML = '';

    function createDomElement(element, classes, inner, fun) {
        let el = document.createElement(element);
        if (classes.length > 0) {
            el.className = classes;
        }
        if (inner != null) {
            el.innerHTML = inner;
        }
        if (fun != null) {
            el.onclick = fun;
        }
        return el;
    }

    function anidar(padre, hijo) {
        padre.appendChild(hijo);
    }

    // CADA ITEM DEL CARRITO REPRESENTADO EN 'LI'
    cart.forEach(item => {

        // ELEMENTO LI - PRINCIPAL
        let entry = createDomElement('li', 'list-group-item');
        anidar(lista, entry);

        // CABECERA DE PRODUCTO
        let divTitulo = createDomElement('div', 'd-flex justify-content-between align-items-end bg-info');
        anidar(entry, divTitulo);
        // NOMBRE PRODUCTO H5
        let divTituloH5 = createDomElement('h5', 'pl-3', item.name.toUpperCase());
        anidar(divTitulo, divTituloH5);
        // BOTÓN BORRAR 
        let divTituloBoton = createDomElement('div', 'pl-5');
        anidar(divTitulo, divTituloBoton);
        let botonEliminarElemento = createDomElement('button', 'btn btn-outline-light btn-sm m-2', ``, function() {removeElementFromCart(item.id)});
        anidar(divTituloBoton, botonEliminarElemento);
        let botonEliminarElementoIcono = createDomElement('i', 'fas fa-trash-alt');
        anidar(botonEliminarElemento, botonEliminarElementoIcono);


        // CONTAINER INFORMACIÓN DEL PRODUCTO EN EL CARRITO
        let containerInformacion = createDomElement('div', 'container');
        anidar(entry, containerInformacion);
        let rowQuantity = createDomElement('div', 'row justify-content-end');
        anidar(containerInformacion, rowQuantity);

        // CANTIDAD EN EL CARRITO
        let colQuantity = createDomElement('div', 'col-10 span-4 d-flex justify-content-between align-items-end mt-1 text-italic');
        anidar(rowQuantity, colQuantity);
        let rotuloQuantity = createDomElement('h6', 'font-italic text-secondary', 'Quantity:');
        anidar(colQuantity, rotuloQuantity);

        // BOTONES - + PARA LA CANTIDAD
        let divBotonesQuantity = createDomElement('div', 'd-flex');
        anidar(colQuantity, divBotonesQuantity);
        let botonRestarCantidad = createDomElement('button', 'btn btn-secondary btn-sm p-1', '-', function () { removeFromCart(item.id) });
        anidar(divBotonesQuantity, botonRestarCantidad);
        let botonAnadirCantidad = createDomElement('button', 'btn btn-secondary btn-sm p-1 ml-1', '+', function () { addFromCart(item.id) });
        anidar(divBotonesQuantity, botonAnadirCantidad);

        // TEXTO PARA INDICAR LA CANTIDAD
        let divTextoQuantity = createDomElement('div', 'd-flex justify-content-end align-items-end mt-4');
        anidar(colQuantity, divTextoQuantity);
        let textoQuantity = createDomElement('h6', 'font-italic text-secondary ml-5', item.quantity);
        anidar(divTextoQuantity, textoQuantity);

        // PRECIO UNIDAD
        let rowPrecioUnidad = createDomElement('div', 'row justify-content-end');
        anidar(containerInformacion, rowPrecioUnidad);
        let colPrecioUnidad = createDomElement('div', 'col-10 d-flex justify-content-between align-items-end mt-1 text-italic');
        anidar(rowPrecioUnidad, colPrecioUnidad);
        let rotuloPrecioUnidad = createDomElement('h6', 'font-italic text-secondary', 'Precio Unidad:');
        anidar(colPrecioUnidad, rotuloPrecioUnidad);
        let textoPrecioUnidad = createDomElement('h6', 'ml-5 font-italic text-secondary', `${item.price} €`);
        anidar(colPrecioUnidad, textoPrecioUnidad);

        // SE MOSTRARÁ O NO INFORMACIÓN SOBRE DESCUENTOS
        if (item.subtotalWithDiscount > 0) {

            // CONTAINER DETALLE DESCUENTOS Y SUBTOTAL
            let containerDescuentos = createDomElement('div', 'container');
            anidar(entry, containerDescuentos);

            // SUBTOTAL SIN DESCUENTOS
            let rowSubtotalSinDesc = createDomElement('div', 'row justify-content-end');
            anidar(containerDescuentos, rowSubtotalSinDesc);
            let colSubtotalSinDesc = createDomElement('div', 'col-10 span-4 d-flex justify-content-between align-items-end mt-4 text-italic');
            anidar(rowSubtotalSinDesc, colSubtotalSinDesc);
            let rotuloSubtotalSinDesc = createDomElement('h6', 'font-italic text-secondary', 'Subtotal sin descuento:');
            anidar(colSubtotalSinDesc, rotuloSubtotalSinDesc);
            let textoSubtotalSinDesc = createDomElement('h6', 'ml-5 font-italic text-secondary', `${item.subtotal} €`);
            anidar(colSubtotalSinDesc, textoSubtotalSinDesc);

            // DESCUENTO
            let rowDescuento = createDomElement('div', 'row justify-content-end');
            anidar(containerDescuentos, rowDescuento);
            let colDescuento = createDomElement('div', 'col-10 d-flex justify-content-between align-items-end mt-1 text-italic');
            anidar(rowDescuento, colDescuento);
            let rotuloDescuento = createDomElement('h6', 'font-italic text-success', 'Descuento:');
            anidar(colDescuento, rotuloDescuento);
            let textoDescuento = createDomElement('h6', 'ml-5 font-italic text-success', `${item.subtotal - item.subtotalWithDiscount} €`);
            anidar(colDescuento, textoDescuento);

            // PRECIO UNIDAD CON DESCUENTO
            let rowPrecioUnidadConDescuento = createDomElement('div', 'row justify-content-end');
            anidar(containerDescuentos, rowPrecioUnidadConDescuento);
            let colPUCD = createDomElement('div', 'col-10 d-flex justify-content-between align-items-center mt-1 text-italic bg-warning');
            anidar(rowPrecioUnidadConDescuento, colPUCD);
            let rotuloPUCD = createDomElement('h6', 'font-italic text-white', 'Precio unidad c/descuento:');
            anidar(colPUCD, rotuloPUCD);
            let textoPUCD = createDomElement('h6', 'ml-5 font-italic text-white', `${item.subtotalWithDiscount / item.quantity} €`);
            anidar(colPUCD, textoPUCD);

            // CONTAINER SUBTOTAL CON DESCUENTO
            let containerSubtotalConDescuento = createDomElement('div', 'container');
            anidar(entry, containerSubtotalConDescuento);

            // SUBTOTAL CON DESCUENTO
            let rowSCD = createDomElement('div', 'row justify-content-end');
            anidar(containerSubtotalConDescuento, rowSCD);
            let colSCD = createDomElement('div', 'col-10 span-4 d-flex justify-content-between align-items-end mt-4 text-italic');
            anidar(rowSCD, colSCD);
            let rotuloSCD = createDomElement('h5', '', 'Subtotal:');
            anidar(colSCD, rotuloSCD);
            let textoSCD = createDomElement('h5', 'ml-5', `${item.subtotalWithDiscount} €`);
            anidar(colSCD, textoSCD);

        } else {
            // SUBTOTAL
            let containerSubtotal = createDomElement('div', 'container');
            anidar(entry, containerSubtotal);

            let rowSubtotal = createDomElement('div', 'row justify-content-end');
            anidar(containerSubtotal, rowSubtotal);
            let colSubtotal = createDomElement('div', 'col-10 span-4 d-flex justify-content-between align-items-end mt-4 text-italic');
            anidar(rowSubtotal, colSubtotal);
            let rotuloSubtotal = createDomElement('h5', '', 'Subtotal:');
            anidar(colSubtotal, rotuloSubtotal);
            let textoSubtotal = createDomElement('h5', 'ml-5', `${item.subtotal} €`);
            anidar(colSubtotal, textoSubtotal);
        }


    });

    // TOTAL DEL CARRITO AL FINAL DE LA LISTA
    let totalCarrito = document.getElementById("total");
    totalCarrito.innerHTML = '';


    if (total > 0) {
        let contenedorTotal = createDomElement('div', 'bg-primary text-white d-flex justify-content-between p-2 mb-3');
        anidar(totalCarrito, contenedorTotal);
        let rotuloTotal = createDomElement('h4', 'font-weight-bold', 'TOTAL');
        anidar(contenedorTotal, rotuloTotal);
        let textoTotal = createDomElement('h4', 'font-weight-bold', `${total} €`);
        anidar(contenedorTotal, textoTotal);
    } else {
        let contenedorCarritoVacio = createDomElement('div', 'bg-primary text-white d-flex justify-content-center p-2 mb-3');
        anidar(totalCarrito, contenedorCarritoVacio);
        let carritoVacio = createDomElement('h4', 'font-weight-bold', 'Carrito vacío');
        anidar(contenedorCarritoVacio, carritoVacio);
    }
}



