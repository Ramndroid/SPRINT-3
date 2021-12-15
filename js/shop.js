// Fuente de datos
var products = [];
var discounts = [];

// Get Products []
const requestURL = '../json/products.json';
const request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function () {
    products = request.response;

    // Get Discounts[]
    const requestURLDiscounts = '../json/discounts.json';
    const requestDiscounts = new XMLHttpRequest();
    requestDiscounts.open('GET', requestURLDiscounts);
    requestDiscounts.responseType = 'json';
    requestDiscounts.send();
    requestDiscounts.onload = function () { discounts = requestDiscounts.response; }
}

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
    cart = [];
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

function calculateTotal() {
    // Calculate total price of the cart either using the "cartList" array
    cartList.forEach(product => {
        if (typeof product.price === 'number') {
            total += product.price;
        }
    });
    return total;
}

// Exercise 4
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

// Exercise 5
function applyPromotions() {
    // Apply promotions to each item in the array "cart"
    cart.forEach(item => {

        function applyDiscount(quantity, newPrice) {
            if (item.quantity >= quantity) {
                item.subtotalWithDiscount = newPrice * item.quantity;
            } else {
                item.subtotalWithDiscount = 0;
            }
        }

        function searchAndApplyDiscount(disco) {
            if (disco.newprice > 0) {
                applyDiscount(
                    quantity = disco.quantity,
                    newPrice = disco.newprice
                );

            } else {
                if (disco.newpricepercent.indexOf("/") > 0
                    && disco.newpricepercent.length == 3
                    && !isNaN(disco.newpricepercent[0])
                    && !isNaN(disco.newpricepercent[2])
                ) {
                    let price =
                        item.price * (disco.newpricepercent[0] / disco.newpricepercent[2]);

                    applyDiscount(
                        quantity = disco.quantity,
                        newPrice = price
                    );
                } else if (!isNaN(disco.newpricepercent)) {
                    applyDiscount(
                        quantity = disco.quantity,
                        newPrice = item.price * disco.newpricepercent
                    );
                }
            }
        }

        /*
        switch (item.id) {
            case 1:
                discount(quantity = 3, newPrice = 10);
                break;
            case 3:
                discount(quantity = 10, newPrice = item.price * (2 / 3));
                break;
        }
        */

        discounts.forEach(disco => {
            if (disco.id === item.id) {
                if (disco.expire != "") {
                    if (new Date() < new Date(disco.expire))
                        searchAndApplyDiscount(disco);
                } else searchAndApplyDiscount(disco);
            }
        });
    });
}

// Exercise 7
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
                if (product.subtotalWithDiscount > 0)
                    subtotal.grocery.discount += product.subtotal - product.subtotalWithDiscount;
                break;

            case 'beauty':
                subtotal.beauty.value += product.subtotal;
                if (product.subtotalWithDiscount > 0)
                    subtotal.beauty.discount += product.subtotal - product.subtotalWithDiscount;
                break;

            case 'clothes':
                subtotal.clothes.value += product.subtotal;
                if (product.subtotalWithDiscount > 0)
                    subtotal.clothes.discount += product.subtotal - product.subtotalWithDiscount;
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

// Exercise 8
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

function removeElementFromCart(id) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart.splice(i, 1);
        }
    }

    printCart();
}

function removeCart() {
    cart = [];
    printCart();
}

// Exercise 9
function printCart() {

    // Aplicar promociones a 'cart'
    applyPromotions();

    // Calcular subtotales
    calculateSubtotalsCart();

    // Calcular total
    calculateTotalCart();

    // Mostrar cart
    generateDOMCart();

}

// GENERATE DOM CART
// La maquetación del cart es horrible, es solo funcional, en el nivel 3 sí exploro darle una mejor apariencia :)
function generateDOMCart() {
    let rotulo1 = 'h5';
    let rotulo2 = 'h6';

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

    // Vincular lista del DOM y resetearla
    let lista = document.getElementById("lista");
    lista.innerHTML = '';

    // CADA ITEM DEL CARRITO REPRESENTADO EN 'LI'
    cart.forEach(item => {

        // ELEMENTO LI - PRINCIPAL
        let entry = createDomElement('li', 'list-group-item');
        anidar(lista, entry);

        // CABECERA DE PRODUCTO
        let divTitulo = createDomElement('div', 'd-flex justify-content-between align-items-end bg-info');
        anidar(entry, divTitulo);
        // NOMBRE PRODUCTO H5
        anidar(divTitulo, createDomElement(rotulo1, 'pl-3', item.name.toUpperCase()));
        // BOTÓN BORRAR 
        let divTituloBoton = createDomElement('div', 'pl-5');
        anidar(divTitulo, divTituloBoton);
        let botonEliminarElemento = createDomElement('button', 'btn btn-outline-light btn-sm m-2', ``, function () { removeElementFromCart(item.id) });
        anidar(divTituloBoton, botonEliminarElemento);
        anidar(botonEliminarElemento, createDomElement('i', 'fas fa-trash-alt'));


        // CONTAINER INFORMACIÓN DEL PRODUCTO EN EL CARRITO
        let containerInformacion = createDomElement('div', 'container');
        anidar(entry, containerInformacion);
        let rowQuantity = createDomElement('div', 'row justify-content-end');
        anidar(containerInformacion, rowQuantity);

        // CANTIDAD EN EL CARRITO
        let colQuantity = createDomElement('div', 'col-10 span-4 d-flex justify-content-between align-items-end mt-1 text-italic');
        anidar(rowQuantity, colQuantity);
        anidar(colQuantity, createDomElement(rotulo2, 'font-italic text-secondary', 'Quantity:'));

        // BOTONES - + PARA LA CANTIDAD
        let divBotonesQuantity = createDomElement('div', 'd-flex');
        anidar(colQuantity, divBotonesQuantity);
        anidar(divBotonesQuantity, createDomElement('button', 'btn btn-secondary btn-sm p-1', '-', function () { removeFromCart(item.id) }));
        anidar(divBotonesQuantity, createDomElement('button', 'btn btn-secondary btn-sm p-1 ml-1', '+', function () { addFromCart(item.id) }));

        // TEXTO PARA INDICAR LA CANTIDAD
        let divTextoQuantity = createDomElement('div', 'd-flex justify-content-end align-items-end mt-4');
        anidar(colQuantity, divTextoQuantity);
        anidar(divTextoQuantity, createDomElement(rotulo2, 'font-italic text-secondary ml-5', item.quantity));

        // PRECIO UNIDAD
        let rowPrecioUnidad = createDomElement('div', 'row justify-content-end');
        anidar(containerInformacion, rowPrecioUnidad);
        let colPrecioUnidad = createDomElement('div', 'col-10 d-flex justify-content-between align-items-end mt-1 text-italic');
        anidar(rowPrecioUnidad, colPrecioUnidad);
        anidar(colPrecioUnidad, createDomElement(rotulo2, 'font-italic text-secondary', '$/unit:'));
        anidar(colPrecioUnidad, createDomElement(rotulo2, 'ml-5 font-italic text-secondary', `$ ${item.price.toFixed(2)}`));

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
            anidar(colSubtotalSinDesc, createDomElement(rotulo2, 'font-italic text-secondary', 'Subtotal w/o discount:'));
            anidar(colSubtotalSinDesc, createDomElement(rotulo2, 'ml-5 font-italic text-secondary', `$ ${item.subtotal.toFixed(2)}`));

            // DESCUENTO
            let rowDescuento = createDomElement('div', 'row justify-content-end');
            anidar(containerDescuentos, rowDescuento);
            let colDescuento = createDomElement('div', 'col-10 d-flex justify-content-between align-items-end mt-1 text-italic');
            anidar(rowDescuento, colDescuento);
            anidar(colDescuento, createDomElement(rotulo2, 'font-italic text-success', 'Discount:'));
            anidar(colDescuento, createDomElement(rotulo2, 'ml-5 font-italic text-success', `$ ${(item.subtotal - item.subtotalWithDiscount).toFixed(2)}`));

            // PRECIO UNIDAD CON DESCUENTO
            let rowPrecioUnidadConDescuento = createDomElement('div', 'row justify-content-end');
            anidar(containerDescuentos, rowPrecioUnidadConDescuento);
            let colPUCD = createDomElement('div', 'col-10 d-flex justify-content-between align-items-center mt-1 text-italic bg-warning');
            anidar(rowPrecioUnidadConDescuento, colPUCD);
            anidar(colPUCD, createDomElement(rotulo2, 'font-italic text-white', '$/unit w/discount'));
            anidar(colPUCD, createDomElement(rotulo2, 'ml-5 font-italic text-white', `$ ${(item.subtotalWithDiscount / item.quantity).toFixed(2)}`));

            // CONTAINER SUBTOTAL CON DESCUENTO
            let containerSubtotalConDescuento = createDomElement('div', 'container');
            anidar(entry, containerSubtotalConDescuento);

            // SUBTOTAL CON DESCUENTO
            let rowSCD = createDomElement('div', 'row justify-content-end');
            anidar(containerSubtotalConDescuento, rowSCD);
            let colSCD = createDomElement('div', 'col-10 span-4 d-flex justify-content-between align-items-end mt-4 text-italic');
            anidar(rowSCD, colSCD);
            anidar(colSCD, createDomElement(rotulo1, '', 'Subtotal:'));
            anidar(colSCD, createDomElement(rotulo1, 'ml-5', `$ ${item.subtotalWithDiscount.toFixed(2)}`));

        } else {
            // SUBTOTAL
            let containerSubtotal = createDomElement('div', 'container');
            anidar(entry, containerSubtotal);

            let rowSubtotal = createDomElement('div', 'row justify-content-end');
            anidar(containerSubtotal, rowSubtotal);
            let colSubtotal = createDomElement('div', 'col-10 span-4 d-flex justify-content-between align-items-end mt-4 text-italic');
            anidar(rowSubtotal, colSubtotal);
            anidar(colSubtotal, createDomElement(rotulo1, '', 'Subtotal:'));
            anidar(colSubtotal, createDomElement(rotulo1, 'ml-5', `$ ${item.subtotal.toFixed(2)}`));
        }


    });

    // TOTAL DEL CARRITO AL FINAL DE LA LISTA
    let totalCarrito = document.getElementById("total");
    totalCarrito.innerHTML = '';


    if (total > 0) {
        let contenedorTotal = createDomElement('div', 'bg-primary text-white d-flex justify-content-between p-2 mb-3');
        anidar(totalCarrito, contenedorTotal);
        anidar(contenedorTotal, createDomElement('h4', 'font-weight-bold', 'TOTAL'));
        anidar(contenedorTotal, createDomElement('h4', 'font-weight-bold', `$ ${total.toFixed(2)}`));
    } else {
        let contenedorCarritoVacio = createDomElement('div', 'bg-primary text-white d-flex justify-content-center p-2 mb-3');
        anidar(totalCarrito, contenedorCarritoVacio);
        anidar(contenedorCarritoVacio, createDomElement('h4', 'font-weight-bold', 'Carrito vacío'));
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


