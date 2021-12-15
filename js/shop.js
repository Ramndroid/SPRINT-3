// FUENTE DE DATOS
var products = [];
var discounts = [];

// CART []
var cart = [];

// SUBTOTAL {}
var subtotal = {
    makeup: {
        value: 0,
        discount: 0
    },
    oil: {
        value: 0,
        discount: 0
    },
    stationery: {
        value: 0,
        discount: 0
    }
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

    if (sessionStorage.getItem("mycart") != null) {
        let mc = sessionStorage.getItem("mycart");
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

            case 'stationery':
                subtotal.stationery.value += product.subtotal;
                if (product.subtotalWithDiscount > 0)
                    subtotal.stationery.discount += product.subtotal - product.subtotalWithDiscount;
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

    // Guardar session storage
    sessionStorage.setItem("mycart", JSON.stringify(cart));
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

    // Guardar session storage
    sessionStorage.setItem("subtotal", JSON.stringify(subtotal));
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
    // Vincular lista del DOM y resetearla
    let lista = document.getElementById("lista");
    lista.innerHTML = '';
    lista.className = "p-0";

    // CADA ITEM DEL CARRITO REPRESENTADO EN 'LI'
    cart.forEach(item => {
        let entry = createDomElement('li', 'list-group-item');
        anidar(lista, entry);

        let cardDiv = createDomElement('div', 'card shadow-sm');
/*          */let cardHeaderDiv = createDomElement('div', 'card-header d-flex justify-content-between');
/*              */let cardTitle = createDomElement('p', 'card-title text-primary fs-5', item.name);
/*              */let cardDelete = createDomElement('button', 'btn btn-outline-primary btn-sm fs-5 text-bold', `<i class="bi bi-trash-fill">`, function () { removeElementFromCart(item.id) });
/*          */let cardBodyDiv = createDomElement('div', 'card-body row');
/*              */let cardImageDiv = createDomElement('div', 'col-12 col-sm-4 text-center');
/*                  */let cardImage = createDomElement('img', 'img-fluid img-thumbnail');
/*              */let cardColDiv = createDomElement('div', 'col-12 col-sm-8 p-0');
/*                  */let cardColContainer = createDomElement('div', 'container');
/*                      */let cardColRow = createDomElement('div', 'row');
/*                          */let cardQuantityDiv = createDomElement('div', 'col-12 d-flex justify-content-between mt-1 text-italic ps-2 mb-2');
/*                              */let cardQuantityTitle = createDomElement('p', 'm-0 p-0 text-primary', 'Quantity:');
/*                              */let cardSubtQ = createDomElement('button', 'btn btn-primary botonhover btn-sm ms-auto', '<i class="bi bi-dash-lg">', function () { removeFromCart(item.id) });
/*                              */let cardQuantity = createDomElement('p', 'm-0 p-0 text-primary mx-2', `${item.quantity}`);
/*                              */let cardAddQ = createDomElement('button', 'btn btn-primary botonhover btn-sm', '<i class="bi bi-plus-lg">', function () { addFromCart(item.id) });
/*                          */let cardDollarUnitDiv = createDomElement('div', 'col-12 d-flex justify-content-between text-italic px-2');
/*                              */let cardDollarUnitTitle = createDomElement('p', 'm-0 p-0 text-primary', '$/unit:');
/*                              */let cardDollarUnit = createDomElement('p', 'm-0 p-0 text-muted text-decoration-line-through');
/*                          */let cardDiscDiv = createDomElement('div', 'col-12 d-flex justify-content-between text-italic px-2');
/*                              */let cardDiscTitle = createDomElement('p', 'm-0 p-0 text-primary', 'Discount:');
/*                              */let cardDisc = createDomElement('p', 'm-0 p-0 text-primary', `$${(item.subtotal - item.subtotalWithDiscount).toFixed(2)}`);
/*                          */let cardSubtotalDiv = createDomElement('div', 'col-12 d-flex justify-content-between bg-dark text-white text-italic px-2 mt-2');
/*                              */let cardSubtotalTitle = createDomElement('p', 'm-0 p-0', 'Subtotal');
/*                              */let cardSubtotal = createDomElement('p', 'm-0 p-0');

        cardImage.src = item.imgcart;

        if (item.subtotalWithDiscount > 0) {
            let preciowdics = `<span class = "text-danger text-decoration-line-through" style="font-style:italic;">$${item.price.toFixed(2)}</span> $${(item.subtotalWithDiscount / item.quantity).toFixed(2)}`;
            cardDollarUnit = createDomElement('p', 'm-0 p-0 text-primary', preciowdics);
            let subtotalwdisc = `<span class = "text-warning text-decoration-line-through" style="font-style:italic;">$${item.subtotal.toFixed(2)}</span> $${item.subtotalWithDiscount.toFixed(2)}`;
            cardSubtotal = createDomElement('p', 'm-0 p-0', subtotalwdisc);
        } else {
            cardDollarUnit = createDomElement('p', 'm-0 p-0 text-primary', `$${item.price.toFixed(2)}`);
            cardSubtotal = createDomElement('p', 'm-0 p-0', `$${item.subtotal.toFixed(2)}`);
        }

        anidar(entry, cardDiv);
        anidar(cardDiv, cardHeaderDiv);
        anidar(cardHeaderDiv, cardTitle);
        anidar(cardHeaderDiv, cardDelete);
        anidar(cardDiv, cardBodyDiv);
        anidar(cardBodyDiv, cardImageDiv);
        anidar(cardImageDiv, cardImage);
        anidar(cardBodyDiv, cardColDiv);
        anidar(cardColDiv, cardColContainer);
        anidar(cardColContainer, cardColRow);
        anidar(cardColRow, cardQuantityDiv);
        anidar(cardQuantityDiv, cardQuantityTitle);
        anidar(cardQuantityDiv, cardSubtQ);
        anidar(cardQuantityDiv, cardQuantity);
        anidar(cardQuantityDiv, cardAddQ);
        anidar(cardColRow, cardDollarUnitDiv);
        anidar(cardDollarUnitDiv, cardDollarUnitTitle);
        anidar(cardDollarUnitDiv, cardDollarUnit);
        if (item.subtotalWithDiscount > 0) {
            anidar(cardColRow, cardDiscDiv);
            anidar(cardDiscDiv, cardDiscTitle);
            anidar(cardDiscDiv, cardDisc);
        }
        anidar(cardColRow, cardSubtotalDiv);
        anidar(cardSubtotalDiv, cardSubtotalTitle);
        anidar(cardSubtotalDiv, cardSubtotal);
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
    // ESTE CODIGO LO HE COPIADO Y PEGADO TAL CUAL, PERO COMPRENDO EL FUNCIONAMIENTO QUE SE PLANTEA.
    const imagenes = document.querySelectorAll('.galeria .contenedor-imagen');
    const imagenModal = document.getElementById('imagen-modal');
    imagenes.forEach((imagen) => {
        imagen.addEventListener('click', () => {
            imagenModal.src = imagen.querySelector('img').src;
        });
    });

    // Tooltips de los productos con oferta
    // ESTE CODIGO LO HE COPIADO Y PEGADO TAL CUAL.
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}

