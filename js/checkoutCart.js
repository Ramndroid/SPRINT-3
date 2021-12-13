let cart = [];
const mycart = "mycart";
let total = 0;
let subtotal;

// Comprobar si el navegador es compatible con webstorage
if (typeof (Storage) == "undefined") {
    window.location.href = "https://google.es";
}

if (sessionStorage.getItem(mycart) != null) {
    let mc = sessionStorage.getItem(mycart);
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
        // let botonEliminarElemento = createDomElement('button', 'btn btn-outline-light btn-sm m-2', ``, function () { removeElementFromCart(item.id) });
        // anidar(divTituloBoton, botonEliminarElemento);
        // anidar(botonEliminarElemento, createDomElement('i', 'bi bi-trash-fill'));

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
        // anidar(divBotonesQuantity, createDomElement('button', 'btn btn-primary botonhover btn-sm', '<i class="bi bi-dash-lg">', function () { removeFromCart(item.id) }));
        // anidar(divBotonesQuantity, createDomElement('button', 'btn btn-primary botonhover btn-sm ms-1', '<i class="bi bi-plus-lg">', function () { addFromCart(item.id) }));

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

    // TOTAL DEL CARRITO
    let totalCarrito = document.getElementById("total");
    totalCarrito.innerHTML = '';
    if (total > 0) {
        let contenedorTotal = createDomElement('div', 'bg-primary text-white d-flex justify-content-between p-2 mb-3');
        anidar(totalCarrito, contenedorTotal);
        anidar(contenedorTotal, createDomElement('h4', 'font-weight-bold', 'TOTAL'));
        anidar(contenedorTotal, createDomElement('h4', 'font-weight-bold', `$ ${total.toFixed(2)}`));
    }

    let subtotalsCarrito = document.getElementById("subtotals");
    subtotalsCarrito.innerHTML = '';

    Object.keys(subtotal).forEach(key => {
        console.log(key, subtotal[key].value, subtotal[key].discount);

        if (subtotal[key].value > 0) {
            anidar(subtotalsCarrito, createDomElement('h4', 'bg-primary text-white d-flex justify-content-between my-2', key.toUpperCase()));
            if (subtotal[key].discount > 0) {

                let contenedorStationery = createDomElement('div', 'text-primary d-flex justify-content-between');
                anidar(subtotalsCarrito, contenedorStationery);
                anidar(contenedorStationery, createDomElement('h5', 'ms-4 font-weight-bold', `Subtotal ${key} w/o discount`));
                anidar(contenedorStationery, createDomElement('h5', 'font-weight-bold', `$ ${subtotal[key].value.toFixed(2)}`));

                let contenedorStationeryDiscount = createDomElement('div', 'ms-4 text-primary d-flex justify-content-between');
                anidar(subtotalsCarrito, contenedorStationeryDiscount);
                anidar(contenedorStationeryDiscount, createDomElement('h5', 'font-weight-bold', `Discount ${key}`));
                anidar(contenedorStationeryDiscount, createDomElement('h5', 'font-weight-bold', `$ ${subtotal[key].discount.toFixed(2)}`));

                let contenedorStationerySubtotal = createDomElement('div', 'ms-4 bg-warning text-primary d-flex justify-content-between');
                anidar(subtotalsCarrito, contenedorStationerySubtotal);
                anidar(contenedorStationerySubtotal, createDomElement('h4', 'font-weight-bold', `Subtotal ${key}`));
                anidar(contenedorStationerySubtotal, createDomElement('h4', 'font-weight-bold', `$ ${(subtotal[key].value - subtotal[key].discount).toFixed(2)}`));
            } else {
                let contenedorSubtotalWODiscount = createDomElement('div', 'ms-4 bg-warning text-primary d-flex justify-content-between');
                anidar(subtotalsCarrito, contenedorSubtotalWODiscount);
                anidar(contenedorSubtotalWODiscount, createDomElement('h4', 'font-weight-bold', `Subtotal ${key}`));
                anidar(contenedorSubtotalWODiscount, createDomElement('h4', 'font-weight-bold', `$ ${subtotal[key].value.toFixed(2)}`));
            }
        }



        // switch (key) {
        //     case 'stationery':
        //         anidar(subtotalsCarrito, createDomElement('h4', 'bg-primary text-white d-flex justify-content-between p-2', 'Stationery'));
        //         if (subtotal[key].discount > 0) {

        //             let contenedorStationery = createDomElement('div', 'bg-primary text-white d-flex justify-content-between p-2');
        //             anidar(subtotalsCarrito, contenedorStationery);
        //             anidar(contenedorStationery, createDomElement('h4', 'font-weight-bold', 'Subtotal stationery w/o discount'));
        //             anidar(contenedorStationery, createDomElement('h4', 'font-weight-bold', `$ ${subtotal[key].value.toFixed(2)}`));

        //             let contenedorStationeryDiscount = createDomElement('div', 'bg-primary text-white d-flex justify-content-between p-2 mb-3');
        //             anidar(subtotalsCarrito, contenedorStationeryDiscount);
        //             anidar(contenedorStationeryDiscount, createDomElement('h4', 'font-weight-bold', 'Discount stationery'));
        //             anidar(contenedorStationeryDiscount, createDomElement('h4', 'font-weight-bold', `$ ${subtotal[key].discount.toFixed(2)}`));

        //             let contenedorStationerySubtotal = createDomElement('div', 'bg-primary text-white d-flex justify-content-between p-2 mb-3');
        //             anidar(subtotalsCarrito, contenedorStationerySubtotal);
        //             anidar(contenedorStationerySubtotal, createDomElement('h4', 'font-weight-bold', 'Subtotal stationery'));
        //             anidar(contenedorStationerySubtotal, createDomElement('h4', 'font-weight-bold', `$ ${(subtotal[key].value - subtotal[key].discount).toFixed(2)}`));
        //         } else {
        //             let contenedorSubtotalWODiscount = createDomElement('div', 'bg-primary text-white d-flex justify-content-between p-2');
        //             anidar(subtotalsCarrito, contenedorSubtotalWODiscount);
        //             anidar(contenedorSubtotalWODiscount, createDomElement('h4', 'font-weight-bold', 'Subtotal stationery'));
        //             anidar(contenedorSubtotalWODiscount, createDomElement('h4', 'font-weight-bold', `$ ${subtotal[key].value.toFixed(2)}`));
        //         }

        //         break;

        //     case 'makeup':
        //         break;

        //     case 'oil':
        //         break;
        // }
    });


}