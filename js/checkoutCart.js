let cart = [];
let subtotal;
let total = 0;

// Comprobar si el navegador es compatible con webstorage
// ESTE IF (typeof (Storage) == "undefined") LO HE COPIADO Y NO LO TENGO 100% ESTUDIADO
if (typeof (Storage) == "undefined") {
    window.location.href = "https://google.es"; // Ni idea porque se pone aquí google.es
}
// fin del bloque incomprendido

if (sessionStorage.getItem("mycart") != null) {
    let mc = sessionStorage.getItem("mycart");
    var arrayOfObjects = eval(mc);

    arrayOfObjects.forEach(product => {
        cart.push(product);
    });
}

if (sessionStorage.getItem("subtotal") != null) {
    let st = sessionStorage.getItem("subtotal");
    var arrayOfObjects = JSON.parse(st);
    subtotal = arrayOfObjects;

    total = 0;
    let totalTmp = 0;
    let discountTmp = 0;

    Object.keys(subtotal).forEach(key => {
        totalTmp += subtotal[key].value;
        discountTmp += subtotal[key].discount;
    });

    total = totalTmp - discountTmp;
}


generateDOMCart();

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

// Es una casi copia del mismo método que en shop.js
function generateDOMCart() {
    // Vincular lista del DOM y resetearla
    let lista = document.getElementById("lista");
    lista.innerHTML = '';
    lista.className = "p-0";

    // CADA ITEM DEL CARRITO REPRESENTADO EN 'LI'
    cart.sort(function (a, b) {
        return a.type.localeCompare(b.type);
    });
    
    cart.forEach(item => {
        let entry = createDomElement('li', 'list-group-item');
        anidar(lista, entry);

        let cardDiv = createDomElement('div', 'card shadow-sm');
/*          */let cardHeaderDiv = createDomElement('div', 'd-flex justify-content-between');
/*              */let cardTitle = createDomElement('p', 'card-header text-primary fs-5 w-100', item.name);
/*              */let cardType = createDomElement('p', 'card-header text-muted', item.type);
/*          */let cardBodyDiv = createDomElement('div', 'card-body row');
/*              */let cardImageDiv = createDomElement('div', 'col-12 col-sm-4 text-center');
/*                  */let cardImage = createDomElement('img', 'img-fluid img-thumbnail');
/*              */let cardColDiv = createDomElement('div', 'col-12 col-sm-8 p-0');
/*                  */let cardColContainer = createDomElement('div', 'container');
/*                      */let cardColRow = createDomElement('div', 'row');
/*                          */let cardQuantityDiv = createDomElement('div', 'col-12 d-flex justify-content-between mt-1 text-italic px-2');
/*                              */let cardQuantityTitle = createDomElement('p', 'm-0 p-0 text-primary', 'Quantity:');
/*                              */let cardQuantity = createDomElement('p', 'm-0 p-0 text-primary', `${item.quantity}`);
/*                          */let cardDollarUnitDiv = createDomElement('div', 'col-12 d-flex justify-content-between text-italic px-2');
/*                              */let cardDollarUnitTitle = createDomElement('p', 'm-0 p-0 text-primary', '$/unit:');
/*                              */let cardDollarUnit = createDomElement('p', 'm-0 p-0 text-muted text-decoration-line-through');
/*                          */let cardDiscDiv = createDomElement('div', 'col-12 d-flex justify-content-between text-italic px-2');
/*                              */let cardDiscTitle = createDomElement('p', 'm-0 p-0 text-primary', 'Discount:');
/*                              */let cardDisc = createDomElement('p', 'm-0 p-0 text-primary', `$${(item.subtotal - item.subtotalWithDiscount).toFixed(2)}`);
/*                          */let cardSubtotalDiv = createDomElement('div', 'col-12 d-flex justify-content-between bg-dark text-white text-italic px-2 mt-2');
/*                              */let cardSubtotalTitle = createDomElement('p', 'm-0 p-0', 'Subtotal');
/*                              */let cardSubtotal = createDomElement('p', 'm-0 p-0');

        cardType.style.fontSize = "0.9rem";
        cardType.style.fontStyle = "italic";
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
        anidar(cardHeaderDiv, cardType);
        anidar(cardDiv, cardBodyDiv);
        anidar(cardBodyDiv, cardImageDiv);
        anidar(cardImageDiv, cardImage);
        anidar(cardBodyDiv, cardColDiv);
        anidar(cardColDiv, cardColContainer);
        anidar(cardColContainer, cardColRow);
        anidar(cardColRow, cardQuantityDiv);
        anidar(cardQuantityDiv, cardQuantityTitle);
        anidar(cardQuantityDiv, cardQuantity);
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

    // TOTAL Y SUBTOTAL DEL CARRITO   
    let subtotalsCarrito = document.getElementById("subtotals");
    subtotalsCarrito.innerHTML = '';

    Object.keys(subtotal).forEach(key => {
        if (subtotal[key].value > 0) {
            let tituloSubtotal = createDomElement('div', 'bg-dark text-white d-flex justify-content-between mb-2');
            anidar(subtotalsCarrito, tituloSubtotal);
            anidar(tituloSubtotal, createDomElement('p', 'text-uppercase py-0 ps-2 mb-0', key));
            if (subtotal[key].discount > 0) {
                anidar(tituloSubtotal, createDomElement('p', 'text-uppercase py-0 pe-2 mb-0', `$${(subtotal[key].value - subtotal[key].discount).toFixed(2)}`));
                let contenedorStationery = createDomElement('div', 'text-muted d-flex justify-content-between');
                anidar(subtotalsCarrito, contenedorStationery);
                anidar(contenedorStationery, createDomElement('p', 'fs-6 ms-4 mb-0', `Subtotal ${key} w/o disc.`));
                anidar(contenedorStationery, createDomElement('p', 'fs-6 mb-0 pe-2', `$${subtotal[key].value.toFixed(2)}`));
                let contenedorStationeryDiscount = createDomElement('div', 'text-muted d-flex justify-content-between ms-4');
                anidar(subtotalsCarrito, contenedorStationeryDiscount);
                anidar(contenedorStationeryDiscount, createDomElement('p', 'fs-6 mb-2', `Discount ${key}`));
                anidar(contenedorStationeryDiscount, createDomElement('p', 'fs-6 mb-2 pe-2', `$${subtotal[key].discount.toFixed(2)}`));
            } else {
                anidar(tituloSubtotal, createDomElement('p', 'py-0 pe-2 text-uppercase mb-0', `$${subtotal[key].value.toFixed(2)}`));
            }
        }
    });

    if (total > 0) {
        let contenedorTotal = createDomElement('div', 'text-white bg-dark d-flex justify-content-between px-2 pt-3 pb-0 h-100');
        anidar(subtotalsCarrito, contenedorTotal);
        anidar(contenedorTotal, createDomElement('p', 'fs-3', 'TOTAL'));
        anidar(contenedorTotal, createDomElement('p', 'fs-3', `$${total.toFixed(2)}`));
    }
}
