// FUENTE DE DATOS
var products = [];
var discounts = [];

// CART []
var cart = [];
const mycart = "mycart";

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

// GET PRODUCTS []
const requestURL = '../json/products.json';
const request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();
request.onload = function () {
    products = request.response;

    // GET DISCOUNTS []
    const requestURLDiscounts = '../json/discounts.json';
    const requestDiscounts = new XMLHttpRequest();
    requestDiscounts.open('GET', requestURLDiscounts);
    requestDiscounts.responseType = 'json';
    requestDiscounts.send();
    requestDiscounts.onload = function () {
        discounts = requestDiscounts.response;
        generateDOMProducts();
        cargarCarritoSiExiste();
    }
}

// CARGAR SESSION STORAGE
function cargarCarritoSiExiste() {
    // Comprobar si el navegador es compatible con webstorage
    if (typeof (Storage) == "undefined") {
        window.location.href = "https://google.es";
    }

    if (sessionStorage.getItem(mycart) != null) {
        let mc = sessionStorage.getItem(mycart);
        var arrayOfObjects = eval(mc);

        arrayOfObjects.forEach(product => {
            for (let i = 0; i < product.quantity; i++) {
                addToCart(product.id);
            }
        });
    }
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
                    subtotalWithDiscount: 0,
                    imgcart: product.img[1]
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
    let myCartTitle = document.getElementById('cartModalScrollableTitle');

    let totalProducts = 0;
    cart.forEach(product => {
        totalProducts += product.quantity;
    });
    if (totalProducts > 0) {
        myCart.innerHTML = `<i class="bi bi-cart-fill"></i> My Cart (${totalProducts})`;
        myCartTitle.innerHTML = `<i class="bi bi-cart-fill"></i> My Cart (${totalProducts})`;
    } else {
        myCart.innerHTML = `<i class="bi bi-cart4"></i> My Cart`;
        myCartTitle.innerHTML = `<i class="bi bi-cart4"></i> My Cart`;
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
        let divTitulo = createDomElement('div', 'd-flex justify-content-between align-items-end bg-primary');
        anidar(entry, divTitulo);
        // NOMBRE PRODUCTO H5
        anidar(divTitulo, createDomElement(rotulo1, 'ps-3 text-white', item.name.toUpperCase()));
        // BOTÓN BORRAR 
        let divTituloBoton = createDomElement('div', 'ps-5');
        anidar(divTitulo, divTituloBoton);
        let botonEliminarElemento = createDomElement('button', 'btn btn-outline-light btn-sm m-2', ``, function () { removeElementFromCart(item.id) });
        anidar(divTituloBoton, botonEliminarElemento);
        anidar(botonEliminarElemento, createDomElement('i', 'bi bi-trash-fill'));

        let contenedorGeneral = createDomElement('div', 'd-flex flex-row');
        anidar(entry, contenedorGeneral);

        let imagenProducto = createDomElement('img', 'img-fluid');
        imagenProducto.src = item.imgcart;
        anidar(contenedorGeneral, imagenProducto);

        // CONTAINER INFORMACIÓN DEL PRODUCTO EN EL CARRITO
        let containerInformacion = createDomElement('div', 'container');
        anidar(contenedorGeneral, containerInformacion);
        let rowQuantity = createDomElement('div', 'row justify-content-end');
        anidar(containerInformacion, rowQuantity);

        // CANTIDAD EN EL CARRITO
        let colQuantity = createDomElement('div', 'col-10 span-4 d-flex justify-content-between align-items-end mt-1 text-italic');
        anidar(rowQuantity, colQuantity);
        anidar(colQuantity, createDomElement(rotulo2, 'font-italic text-primary', 'Quantity:'));

        // BOTONES - + PARA LA CANTIDAD
        let divBotonesQuantity = createDomElement('div', 'd-flex');
        anidar(colQuantity, divBotonesQuantity);
        anidar(divBotonesQuantity, createDomElement('button', 'btn btn-primary botonhover btn-sm', '<i class="bi bi-dash-lg">', function () { removeFromCart(item.id) }));
        anidar(divBotonesQuantity, createDomElement('button', 'btn btn-primary botonhover btn-sm ms-1', '<i class="bi bi-plus-lg">', function () { addFromCart(item.id) }));

        // TEXTO PARA INDICAR LA CANTIDAD
        let divTextoQuantity = createDomElement('div', 'd-flex justify-content-end align-items-end mt-4');
        anidar(colQuantity, divTextoQuantity);
        anidar(divTextoQuantity, createDomElement(rotulo2, 'font-italic text-primary ms-5', item.quantity));

        // PRECIO UNIDAD
        let rowPrecioUnidad = createDomElement('div', 'row justify-content-end');
        anidar(containerInformacion, rowPrecioUnidad);
        let colPrecioUnidad = createDomElement('div', 'col-10 d-flex justify-content-between align-items-end mt-1 text-italic');
        anidar(rowPrecioUnidad, colPrecioUnidad);
        anidar(colPrecioUnidad, createDomElement(rotulo2, 'font-italic text-primary', '$/unit:'));
        anidar(colPrecioUnidad, createDomElement(rotulo2, 'ms-5 font-italic text-primary', `$ ${item.price.toFixed(2)}`));

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
            anidar(colSubtotalSinDesc, createDomElement(rotulo2, 'font-italic text-primary', 'Subtotal w/o discount:'));
            anidar(colSubtotalSinDesc, createDomElement(rotulo2, 'ms-5 font-italic text-primary', `$ ${item.subtotal.toFixed(2)}`));

            // DESCUENTO
            let rowDescuento = createDomElement('div', 'row justify-content-end');
            anidar(containerDescuentos, rowDescuento);
            let colDescuento = createDomElement('div', 'col-10 d-flex justify-content-between align-items-end mt-1 text-italic');
            anidar(rowDescuento, colDescuento);
            anidar(colDescuento, createDomElement(rotulo2, 'font-italic text-success', 'Discount:'));
            anidar(colDescuento, createDomElement(rotulo2, 'ms-5 font-italic text-success', `$ ${(item.subtotal - item.subtotalWithDiscount).toFixed(2)}`));

            // PRECIO UNIDAD CON DESCUENTO
            let rowPrecioUnidadConDescuento = createDomElement('div', 'row justify-content-end');
            anidar(containerDescuentos, rowPrecioUnidadConDescuento);
            let colPUCD = createDomElement('div', 'col-10 d-flex justify-content-between align-items-center mt-1 text-italic bg-warning');
            anidar(rowPrecioUnidadConDescuento, colPUCD);
            anidar(colPUCD, createDomElement(rotulo2, 'font-italic text-white', '$/unit w/discount'));
            anidar(colPUCD, createDomElement(rotulo2, 'ms-5 font-italic text-white', `$ ${(item.subtotalWithDiscount / item.quantity).toFixed(2)}`));

            // CONTAINER SUBTOTAL CON DESCUENTO
            let containerSubtotalConDescuento = createDomElement('div', 'container');
            anidar(entry, containerSubtotalConDescuento);

            // SUBTOTAL CON DESCUENTO
            let rowSCD = createDomElement('div', 'row justify-content-end');
            anidar(containerSubtotalConDescuento, rowSCD);
            let colSCD = createDomElement('div', 'col-10 span-4 d-flex justify-content-between align-items-end mt-4 text-italic');
            anidar(rowSCD, colSCD);
            anidar(colSCD, createDomElement(rotulo1, '', 'Subtotal:'));
            anidar(colSCD, createDomElement(rotulo1, 'ms-5', `$ ${item.subtotalWithDiscount.toFixed(2)}`));

        } else {
            // SUBTOTAL
            let containerSubtotal = createDomElement('div', 'container');
            anidar(entry, containerSubtotal);

            let rowSubtotal = createDomElement('div', 'row justify-content-end');
            anidar(containerSubtotal, rowSubtotal);
            let colSubtotal = createDomElement('div', 'col-10 span-4 d-flex justify-content-between align-items-end mt-4 text-italic');
            anidar(rowSubtotal, colSubtotal);
            anidar(colSubtotal, createDomElement(rotulo1, '', 'Subtotal:'));
            anidar(colSubtotal, createDomElement(rotulo1, 'ms-5', `$ ${item.subtotal.toFixed(2)}`));
        }


    });

    // TOTAL DEL CARRITO AL FINAL DE LA LISTA
    let totalCarrito = document.getElementById("total");
    totalCarrito.innerHTML = '';

    let btnClear = document.getElementById('botonRemove');
    let btnCheckout = document.getElementById('botonCheckout');

    let emptyCart = document.getElementById('emptycart');

    if (total > 0) {
        let contenedorTotal = createDomElement('div', 'bg-primary text-white d-flex justify-content-between p-2 mb-3');
        anidar(totalCarrito, contenedorTotal);
        anidar(contenedorTotal, createDomElement('h4', 'font-weight-bold', 'TOTAL'));
        anidar(contenedorTotal, createDomElement('h4', 'font-weight-bold', `$ ${total.toFixed(2)}`));

        btnClear.style.visibility = 'visible';
        btnCheckout.style.visibility = 'visible';
        emptyCart.style.visibility = 'collapse';
    } else {
        btnClear.style.visibility = 'collapse';
        btnCheckout.style.visibility = 'collapse';
        emptyCart.style.visibility = 'visible';
    }

    // Guardar session storage
    sessionStorage.setItem(mycart, JSON.stringify(cart));
    sessionStorage.setItem("subtotal", JSON.stringify(subtotal));

}

function generateDOMProducts() {
    // Get elements by ID
    var stationery = document.getElementById('stationery');
    var makeup = document.getElementById('makeup');
    var oil = document.getElementById('oil');

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
            <div class="contenedor-imagen mb-4 col-6 col-lg-4">
                <a href="#" data-bs-toggle="modal" data-bs-target="#modal-galeria">
                    <img src="img/img-1.jpg" class="card-img mx-auto d-block w-100" alt="">
                </a>
            </div>
            <button type="button" onclick="addToCart(4)" class="btn btn-primary btn-cards text-white align-self-center mt-3">Add to cart</button>
          </div>
        </div> 
        */


        let divCard = createDomElement('div', 'card my-cards border-white shadow');

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
        let discount;

        discounts.forEach(disco => {
            if (disco.id === product.id) {
                if (disco.expire != "") {
                    if (new Date() < new Date(disco.expire)) {
                        incluyeDescuento = true;
                        discount = disco;
                    }

                } else {
                    incluyeDescuento = true;
                    discount = disco;
                }
            }
        });

        let quantity, newPrice;

        if (incluyeDescuento) {
            quantity = discount.quantity;

            if (discount.newprice > 0) {
                quantity = discount.quantity;
                newPrice = discount.newprice;

            } else {
                if (discount.newpricepercent.indexOf("/") > 0
                    && discount.newpricepercent.length == 3
                    && !isNaN(discount.newpricepercent[0])
                    && !isNaN(discount.newpricepercent[2])
                ) {
                    newPrice =
                        product.price * (discount.newpricepercent[0] / discount.newpricepercent[2]);

                } else if (!isNaN(discount.newpricepercent)) {
                    newPrice = product.price * discount.newpricepercent;
                }
            }

            let textTooltip = `Buy ${quantity} or more and pay $${newPrice.toFixed(2)} for each unit!`;


            let offerTextWithTooltip = document.createElement('div');
            offerTextWithTooltip.innerHTML = `
                <h5 style="cursor:pointer" class="text-white bg-warning px-2" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="${textTooltip}">
                Offer!
                </h5>
                `;

            anidar(divOfertaYPrecio, offerTextWithTooltip);
        } else {
            anidar(divOfertaYPrecio, createDomElement('h5', 'card-title text-center text-white fst-italic bg-warning'));
        }

        anidar(divOfertaYPrecio, createDomElement('h2', 'card-text text-muted text-end', `$${product.price}`));

        let divImagenBoton = createDomElement('div', 'd-flex flex-column px-4 mb-3');
        anidar(divCard, divImagenBoton);

        let divContenedorImagen = createDomElement('div', 'contenedor-imagen');
        anidar(divImagenBoton, divContenedorImagen);

        divContenedorImagen.innerHTML = `
        <a href="#" data-bs-toggle="modal" data-bs-target="#modal-galeria">
		    <img src="${product.img[0]}" class="card-img mx-auto d-block w-100" alt="">
		</a>
        `;
        anidar(divImagenBoton, createDomElement('button', 'btn btn-primary btn-cards text-white align-self-center mt-3', 'Add to cart', function () { addToCart(product.id) }));
    });

    // Ventana modal para mostrar la foto del producto ampliada
    const imagenes = document.querySelectorAll('.galeria .contenedor-imagen');
    const imagenModal = document.getElementById('imagen-modal');
    imagenes.forEach((imagen) => {
        imagen.addEventListener('click', () => {
            imagenModal.src = imagen.querySelector('img').src;
        });
    });

    // Tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })

}

