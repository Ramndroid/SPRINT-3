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
// Array with products (objects) added directly with push(). Products in this array are repeated.
var cartList = [];

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

// Exercise 1
function buy(id) {
    // 1. Loop for to the array products to get the item to add to cart
    // 2. Add found product to the cartList array
    products.forEach(product => {
        if (product.id === id) {
            cartList.push(product);
        }
    });
}

// Exercise 2
function cleanCart() {
    cartList = [];
}

// Exercise 3
function calculateSubtotals() {
    // 1. Create a for loop on the "cartList" array 
    // 2. Implement inside the loop an if...else or switch...case to add the quantities of each type of product, obtaining the subtotals: subtotalGrocery, subtotalBeauty and subtotalClothes
    cartList.forEach(product => {
        if (typeof product.price === 'number') {
            switch (product.type) {
                case 'grocery':
                    subtotal.grocery.value += product.price;
                    break;

                case 'beauty':
                    subtotal.beauty.value += product.price;
                    break;

                case 'clothes':
                    subtotal.clothes.value += product.price;
                    break;
            }
        }
    });
    return subtotal;
}

// Exercise 4
function calculateTotal() {
    // Calculate total price of the cart either using the "cartList" array
    cartList.forEach(product => {
        if (typeof product.price === 'number') {
            total += product.price;
        }
    });
    return total;
}

// Exercise 5
function generateCart() {
    // Using the "cartlist" array that contains all the items in the shopping cart, 
    // generate the "cart" array that does not contain repeated items, instead each item of this array "cart" shows the quantity of product.
    cartList.forEach(item => {
        if (cart.filter(cartItem => cartItem.name === item.name).length > 0) {
            cart.forEach(it => {
                if (it.name === item.name) {
                    it.quantity += 1;
                    it.subtotal = item.price * it.quantity;
                }
            });
        } else {
            let element = {
                id: item.id,
                name: item.name,
                price: item.price,
                type: item.type,
                quantity: 1,
                subtotal: item.price,
                subtotalWithDiscount: 0
            };

            cart.push(element);
        }
    });
}

// Exercise 6
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

// Exercise 7
function addToCart(id) {
    // Refactor previous code in order to simplify it 
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

// Ejercicio 7 refactorizar [basarnos en 'cart' en vez de 'cartList']
// En esta ocasión ya doy por válidos los typeof de product.price como 'number'
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

// Ejercicio 7 refactorizar [basarnos en 'cart' en vez de 'cartList']
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

// Exercise 9
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

function removeElementFromCart(id) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart.splice(i, 1);
        }
    }

    printCart();
}

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

// Exercise 10
function printCart() {
    // Aplicar promociones a 'cart'
    applyPromotionsCart();

    // Calcular subtotales
    calculateSubtotalsCart();

    // Calcular total
    calculateTotalCart();

    let lista = document.getElementById("lista");
    lista.innerHTML = '';

    function createDomElement(element, classes) {
        let el = document.createElement(element);
        if (classes.length > 0) {
            el.className = classes;
            return el;
        }
        return el;
    }

    // CADA ITEM DEL CARRITO REPRESENTADO EN 'LI'
    cart.forEach(item => {
        // ELEMENTO LI - PRINCIPAL
        let entry = createDomElement('li', 'list-group-item');
        lista.appendChild(entry);
        // CABECERA DE PRODUCTO
        let divTitulo = createDomElement('div', 'd-flex justify-content-between align-items-end bg-info');
        entry.appendChild(divTitulo);
        // NOMBRE PRODUCTO H5
        let divTituloH5 = createDomElement('h5', 'pl-3');
        divTituloH5.innerHTML = item.name.toUpperCase();
        divTitulo.appendChild(divTituloH5);
        // BOTÓN BORRAR - DIV
        let divTituloBoton = createDomElement('div', 'pl-5');
        divTitulo.appendChild(divTituloBoton);
        // BOTÓN BORRAR - BUTTON
        let botonEliminarElemento = createDomElement('button', 'btn btn-outline-light btn-sm m-2');
        botonEliminarElemento.onclick = function () { removeElementFromCart(item.id) };
        divTituloBoton.appendChild(botonEliminarElemento);
        // BOTÓN BORRAR - ICONO
        let botonEliminarElementoIcono = createDomElement('i', 'fas fa-trash-alt');
        botonEliminarElemento.appendChild(botonEliminarElementoIcono);


        // CONTAINER INFORMACIÓN DEL PRODUCTO EN EL CARRITO
        let containerInformacion = createDomElement('div', 'container');
        entry.appendChild(containerInformacion);
        let rowQuantity = createDomElement('div', 'row justify-content-end');
        containerInformacion.appendChild(rowQuantity);

        // CANTIDAD EN EL CARRITO
        let colQuantity = createDomElement('div', 'col-10 span-4 d-flex justify-content-between align-items-end mt-1 text-italic');
        rowQuantity.appendChild(colQuantity);
        let rotuloQuantity = createDomElement('h6', 'font-italic text-secondary');
        rotuloQuantity.innerHTML = 'Quantity:';
        colQuantity.appendChild(rotuloQuantity);

        // BOTONES - + PARA LA CANTIDAD
        let divBotonesQuantity = createDomElement('div', 'd-flex');
        colQuantity.appendChild(divBotonesQuantity);
        let botonRestarCantidad = createDomElement('button', 'btn btn-secondary btn-sm p-1');
        botonRestarCantidad.innerHTML = '-';
        botonRestarCantidad.onclick = function () { removeFromCart(item.id) };
        divBotonesQuantity.appendChild(botonRestarCantidad);
        let botonAnadirCantidad = createDomElement('button', 'btn btn-secondary btn-sm p-1 ml-1');
        botonAnadirCantidad.innerHTML = '+';
        botonAnadirCantidad.onclick = function () { addFromCart(item.id) };
        divBotonesQuantity.appendChild(botonAnadirCantidad);

        // TEXTO PARA INDICAR LA CANTIDAD
        let divTextoQuantity = createDomElement('div', 'd-flex justify-content-end align-items-end mt-4');
        colQuantity.appendChild(divTextoQuantity);
        let textoQuantity = createDomElement('h6', 'font-italic text-secondary ml-5');
        textoQuantity.innerHTML = item.quantity;
        divTextoQuantity.appendChild(textoQuantity);

        // PRECIO UNIDAD
        let rowPrecioUnidad = createDomElement('div', 'row justify-content-end');
        containerInformacion.appendChild(rowPrecioUnidad);
        let colPrecioUnidad = createDomElement('div', 'col-10 d-flex justify-content-between align-items-end mt-1 text-italic');
        rowPrecioUnidad.appendChild(colPrecioUnidad);
        let rotuloPrecioUnidad = createDomElement('h6', 'font-italic text-secondary');
        rotuloPrecioUnidad.innerHTML = 'Precio Unidad:';
        colPrecioUnidad.appendChild(rotuloPrecioUnidad);
        let textoPrecioUnidad = createDomElement('h6', 'ml-5 font-italic text-secondary');
        textoPrecioUnidad.innerHTML = `${item.price} €`;
        colPrecioUnidad.appendChild(textoPrecioUnidad);

        // SE MOSTRARÁ O NO INFORMACIÓN SOBRE DESCUENTOS
        if (item.subtotalWithDiscount > 0) {

            // CONTAINER DETALLE DESCUENTOS Y SUBTOTAL
            let containerDescuentos = createDomElement('div', 'container');
            entry.appendChild(containerDescuentos);

            // SUBTOTAL SIN DESCUENTOS
            let rowSubtotalSinDesc = createDomElement('div', 'row justify-content-end');
            containerDescuentos.appendChild(rowSubtotalSinDesc);
            let colSubtotalSinDesc = createDomElement('div', 'col-10 span-4 d-flex justify-content-between align-items-end mt-4 text-italic');
            rowSubtotalSinDesc.appendChild(colSubtotalSinDesc);
            let rotuloSubtotalSinDesc = createDomElement('h6', 'font-italic text-secondary');
            rotuloSubtotalSinDesc.innerHTML = 'Subtotal sin descuento:';
            colSubtotalSinDesc.appendChild(rotuloSubtotalSinDesc);
            let textoSubtotalSinDesc = createDomElement('h6', 'ml-5 font-italic text-secondary');
            textoSubtotalSinDesc.innerHTML = `${item.subtotal} €`;
            colSubtotalSinDesc.appendChild(textoSubtotalSinDesc);

            // DESCUENTO
            let rowDescuento = createDomElement('div', 'row justify-content-end');
            containerDescuentos.appendChild(rowDescuento);
            let colDescuento = createDomElement('div', 'col-10 d-flex justify-content-between align-items-end mt-1 text-italic');
            rowDescuento.appendChild(colDescuento);
            let rotuloDescuento = createDomElement('h6', 'font-italic text-success');
            rotuloDescuento.innerHTML = 'Descuento:';
            colDescuento.appendChild(rotuloDescuento);
            let textoDescuento = createDomElement('h6', 'ml-5 font-italic text-success');
            textoDescuento.innerHTML = `${item.subtotal - item.subtotalWithDiscount} €`;
            colDescuento.appendChild(textoDescuento);

            // PRECIO UNIDAD CON DESCUENTO
            let rowPrecioUnidadConDescuento = createDomElement('div', 'row justify-content-end');
            containerDescuentos.appendChild(rowPrecioUnidadConDescuento);
            let colPUCD = createDomElement('div', 'col-10 d-flex justify-content-between align-items-center mt-1 text-italic bg-warning');
            rowPrecioUnidadConDescuento.appendChild(colPUCD);
            let rotuloPUCD = createDomElement('h6', 'font-italic text-white');
            rotuloPUCD.innerHTML = 'Precio unidad c/descuento:';
            colPUCD.appendChild(rotuloPUCD);
            let textoPUCD = createDomElement('h6', 'ml-5 font-italic text-white');
            textoPUCD.innerHTML = `${item.subtotalWithDiscount / item.quantity} €`;
            colPUCD.appendChild(textoPUCD);

            // CONTAINER SUBTOTAL CON DESCUENTO
            let containerSubtotalConDescuento = createDomElement('div', 'container');
            entry.appendChild(containerSubtotalConDescuento);

            // SUBTOTAL CON DESCUENTO
            let rowSCD = createDomElement('div', 'row justify-content-end');
            containerSubtotalConDescuento.appendChild(rowSCD);
            let colSCD = createDomElement('div', 'col-10 span-4 d-flex justify-content-between align-items-end mt-4 text-italic');
            rowSCD.appendChild(colSCD);
            let rotuloSCD = createDomElement('h5', '');
            rotuloSCD.innerHTML = 'Subtotal:';
            colSCD.appendChild(rotuloSCD);
            let textoSCD = createDomElement('h5', 'ml-5');
            textoSCD.innerHTML = `${item.subtotalWithDiscount} €`;
            colSCD.appendChild(textoSCD);

        } else {
            // SUBTOTAL
            let containerSubtotal = createDomElement('div', 'container');
            entry.appendChild(containerSubtotal);

            let rowSubtotal = createDomElement('div', 'row justify-content-end');
            containerSubtotal.appendChild(rowSubtotal);
            let colSubtotal = createDomElement('div', 'col-10 span-4 d-flex justify-content-between align-items-end mt-4 text-italic');
            rowSubtotal.appendChild(colSubtotal);
            let rotuloSubtotal = createDomElement('h5', '');
            rotuloSubtotal.innerHTML = 'Subtotal:';
            colSubtotal.appendChild(rotuloSubtotal);
            let textoSubtotal = createDomElement('h5', 'ml-5');
            textoSubtotal.innerHTML = `${item.subtotal} €`;
            colSubtotal.appendChild(textoSubtotal);
        }


    });

    // TOTAL DEL CARRITO AL FINAL DE LA LISTA
    let totalCarrito = document.getElementById("total");
    totalCarrito.innerHTML = '';


    if (total > 0) {
        let contenedorTotal = createDomElement('div', 'bg-primary text-white d-flex justify-content-between p-2 mb-3');
        totalCarrito.appendChild(contenedorTotal);
        let rotuloTotal = createDomElement('h4', 'font-weight-bold');
        rotuloTotal.innerHTML = 'TOTAL';
        contenedorTotal.appendChild(rotuloTotal);
        let textoTotal = createDomElement('h4', 'font-weight-bold');
        textoTotal.innerHTML = `${total} €`;
        contenedorTotal.appendChild(textoTotal);
    } else {
        let contenedorCarritoVacio = createDomElement('div', 'bg-primary text-white d-flex justify-content-center p-2 mb-3');
        totalCarrito.appendChild(contenedorCarritoVacio);
        let carritoVacio = createDomElement('h4', 'font-weight-bold');
        carritoVacio.innerHTML = 'Carrito vacío';
        contenedorCarritoVacio.appendChild(carritoVacio);
    }
}

// En esta funcion (en desuso) manipulo el dom literalmente mediante .innerHTML = `<div>...`;
function printCartDeprecated() {
    // Fill the shopping cart modal manipulating the shopping cart dom

    // Aplicar promociones a 'cart'
    applyPromotionsCart();

    // Calcular subtotales
    calculateSubtotalsCart();

    // Calcular total
    calculateTotalCart();

    let lista = document.getElementById("lista");
    lista.innerHTML = '';

    cart.forEach(item => {
        let entry = document.createElement('li');
        entry.className = "list-group-item";

        let texto =
            `
        
        <div class="d-flex justify-content-between align-items-end bg-info"> 
            <h5 class="pl-3">${item.name.toUpperCase()}</h5> 
            <div class="pl-5">
                <button class="btn btn-outline-light btn-sm m-2" onclick="removeElementFromCart(${item.id})"><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>

        

        <div class="container">
            <div class="row justify-content-end">
                <div class="col-10 span-4 d-flex justify-content-between align-items-end mt-1 text-italic">
                    <h6 class="font-italic text-secondary">Quantity:</h6>
                    <div class="d-flex"> 
                         <button class="btn btn-secondary btn-sm p-1" onclick="removeFromCart(${item.id})">-</button>
                         <button class="btn btn-secondary btn-sm p-1 ml-1" onclick="addFromCart(${item.id})">+</button>
                    </div>
                    <div class="d-flex justify-content-end align-items-end mt-4"> 
                         <h6 class="font-italic text-secondary ml-5">${item.quantity}</h6>
                    </div>
                    
                </div>
            </div>

            <div class="row justify-content-end">
                <div class=" col-10 d-flex justify-content-between align-items-end mt-1 text-italic">
                    <h6 class="font-italic text-secondary">Precio unidad:</h6>
                    <h6 class="ml-5 font-italic text-secondary">${item.price} €</h6>
                </div>
            </div>
        </div>
        
        
        `;

        if (item.subtotalWithDiscount > 0) {
            texto += `



            <div class="container">
                <div class="row justify-content-end">
                    <div class="col-10 span-4 d-flex justify-content-between align-items-end mt-4 text-italic">
                        <h6 class="font-italic text-secondary">Subtotal sin descuento:</h6>
                        <h6 class="ml-5 font-italic text-secondary">${item.subtotal} €</h6>
                    </div>
                </div>

                <div class="row justify-content-end">
                    <div class=" col-10 d-flex justify-content-between align-items-end mt-1 text-italic">
                        <h6 class="font-italic text-success">Descuento:</h6>
                        <h6 class="ml-5 font-italic text-success">${item.subtotal - item.subtotalWithDiscount} €</h6>
                    </div>
                </div>

                <div class="row justify-content-end">
                    <div class=" col-10 d-flex justify-content-between align-items-center mt-1 text-italic bg-warning">
                        <h6 class="font-italic text-white">Precio unidad c/descuento:</h6>
                        <h6 class="ml-5 font-italic text-white">${item.subtotalWithDiscount / item.quantity} €</h6>
                    </div>
                </div>
            </div>

            <div class="container">
                <div class="row justify-content-end">
                    <div class="col-10 span-4 d-flex justify-content-between align-items-end mt-4 text-italic">
                        <h5>Subtotal:</h5>
                        <h5 class="ml-5">${item.subtotalWithDiscount} €</h5>
                    </div>
                </div>
            </div>
            <br>
            `;
        } else {
            texto += `
            <div class="container">
                <div class="row justify-content-end">
                    <div class="col-10 span-4 d-flex justify-content-between align-items-end mt-4 text-italic">
                        <h5>Subtotal:</h5>
                        <h5 class="ml-5">${item.subtotal} €</h5>
                    </div>
                </div>
            </div>
            <br>
            `;
        }

        entry.innerHTML = texto;
        lista.appendChild(entry);
    });


    let totalCarrito = document.getElementById("total");
    if (total > 0) {
        totalCarrito.innerHTML = `
        <div class="bg-primary text-white d-flex justify-content-between p-2 mb-3">
            <h4 class="font-weight-bold">TOTAL</h4> 
            <h4 class="font-weight-bold">${total} €</h4>
        </div>
        `;
    } else {
        totalCarrito.innerHTML = `
        <div class="bg-primary text-white d-flex justify-content-center p-2 mb-3">
            <h4 class="font-weight-bold">Carrito vacio</h4>
        </div>
        `;
    }

}


