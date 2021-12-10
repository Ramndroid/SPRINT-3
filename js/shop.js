// Get Products []
var products = [];
const requestURL = '../json/products.json';
const request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function () { products = request.response; }

// Get Discounts[]
var discounts = [];
const requestURLDiscounts = '../json/discounts.json';
const requestDiscounts = new XMLHttpRequest();
requestDiscounts.open('GET', requestURLDiscounts);
requestDiscounts.responseType = 'json';
requestDiscounts.send();
requestDiscounts.onload = function () {
    discounts = requestDiscounts.response;
    generateDOMProducts();
}

// CART []
var cart = [];

// SUBTOTAL {}
var subtotal = {
    stationery: {
        value: 0,
        discount: 0
    },
    makeup: {
        value: 0,
        discount: 0
    },
    oil: {
        value: 0,
        discount: 0
    },
};

// TOTAL 0
var total = 0;

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

    printMyCartText();
}

// APPLY PROMOTIONS CART
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

// CALCULATE SUBTOTAL
function calculateSubtotals() {
    Object.keys(subtotal).forEach(key => {
        subtotal[key].value = 0;
        subtotal[key].discount = 0;
    });

    cart.forEach(product => {
        switch (product.type) {
            case 'stationery':
                subtotal.stationery.value += product.subtotal;
                if (product.subtotalWithDiscount > 0)
                    subtotal.stationery.discount += product.subtotal - product.subtotalWithDiscount;
                break;

            case 'makeup':
                subtotal.makeup.value += product.subtotal;
                if (product.subtotalWithDiscount > 0)
                    subtotal.makeup.discount += product.subtotal - product.subtotalWithDiscount;
                break;

            case 'oil':
                subtotal.oil.value += product.subtotal;
                if (product.subtotalWithDiscount > 0)
                    subtotal.oil.discount += product.subtotal - product.subtotalWithDiscount;
                break;
        }
    });
}

// CALCULATE TOTAL
function calculateTotal() {
    total = 0;
    let totalTmp = 0;
    let discountTmp = 0;

    Object.keys(subtotal).forEach(key => {
        totalTmp += subtotal[key].value;
        discountTmp += subtotal[key].discount;
    });

    total = totalTmp - discountTmp;
}

// REMOVE CART
function removeCart() {
    cart = [];
    printCart();
    printMyCartText();
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
    printMyCartText();
}

// REMOVE ITEM FROM CART
function removeElementFromCart(id) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart.splice(i, 1);
        }
    }

    printCart();
    printMyCartText();
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
    printMyCartText();
}

// MODIFICAR LA CANTIDAD EN 'My Cart ()'
function printMyCartText() {
    let myCart = document.getElementById('myCart');
    let totalProducts = 0;
    cart.forEach(product => {
        totalProducts += product.quantity;
    });
    if (totalProducts > 0) {
        myCart.innerHTML = `My Cart (${totalProducts})`;
    } else {
        myCart.innerHTML = `My Cart`;
    }

}

// PRINT CART
function printCart() {

    // Aplicar promociones a 'cart'
    applyPromotions();

    // Calcular subtotales
    calculateSubtotals();

    // Calcular total
    calculateTotal();

    // Mostrar cart
    generateDOMCart();

}

// MANIPULAR EL DOM
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

// GENERATE DOM CART
function generateDOMCart() {
    let rotulo1 = 'h5';
    let rotulo2 = 'h6';

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

function generateDOMProducts() {
    // Get elements by ID
    var stationery = document.getElementById('stationery');
    var makeup = document.getElementById('makeup');
    var oil = document.getElementById('oil');

    console.log(products.length);

    products.forEach(product => {

        /*
        <div
          class="card my-cards border-white shadow align-self-start align-self-sm-start align-self-md-start align-self-lg-start">
          <div class="d-flex flex-column px-4 mt-4">
            <h5 class="card-title fs-4 fw-bold text-primary">All-in-1</h5>
            <div class="d-flex justify-content-between mb-4">
              <h5 class="card-title text-center text-white fst-italic bg-warning">Special offer</h5>
              <h2 class="card-text text-muted text-end">$260</h2>
            </div>
          </div>
          <div class="d-flex flex-column px-4 mb-3">
            <img class="card-img mx-auto" src="./images/makeup-1.jpg">
            <button type="button" onclick="addToCart(4)" class="btn btn-primary btn-cards text-white align-self-center mt-3">Add to cart</button>
          </div>
        </div> 
        */


        let divCard = createDomElement('div', 'card my-cards border-white shadow align-self-start align-self-sm-start align-self-md-start align-self-lg-start');

        switch (product.type) {
            case "stationery": anidar(stationery, divCard);
                break;
            case "makeup": anidar(makeup, divCard);
                break;
            case "oil": anidar(oil, divCard);
                break;
        }

        let divBody = createDomElement('div', 'd-flex flex-column px-4 mt-4');
        anidar(divCard, divBody);
        anidar(divBody, createDomElement('h5', 'card-title fs-4 fw-bold text-primary', product.name));
        let divOfertaYPrecio = createDomElement('div', 'd-flex justify-content-between mb-4');
        anidar(divBody, divOfertaYPrecio);

        let incluyeDescuento = false;
        discounts.forEach(disco => {
            if (disco.id === product.id) {
                if (disco.expire != "") {
                    if (new Date() < new Date(disco.expire))
                        incluyeDescuento = true;
                } else incluyeDescuento = true;
            }
        });

        if (incluyeDescuento) {
            anidar(divOfertaYPrecio, createDomElement('h5', 'card-title text-center text-white fst-italic bg-warning', 'Special offer'));
        } else {
            anidar(divOfertaYPrecio, createDomElement('h5', 'card-title text-center text-white fst-italic bg-warning'));
        }

        anidar(divOfertaYPrecio, createDomElement('h2', 'card-text text-muted text-end', `$${product.price}`));

        let divImagenBoton = createDomElement('div', 'd-flex flex-column px-4 mb-3');
        anidar(divCard, divImagenBoton);

        let imagenProducto = document.createElement('img');
        imagenProducto.className = "card-img mx-auto";
        imagenProducto.src = product.img[0];
        anidar(divImagenBoton, imagenProducto);
        
        anidar(divImagenBoton, createDomElement('button', 'btn btn-primary btn-cards text-white align-self-center mt-3', 'Add to cart', function () { addToCart(product.id) }));



    });
}

