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

// Exercise 4
function calculateTotal() {
    // Calculate total price of the cart either using the "cartList" array
    cartList.forEach(product => {
        if (typeof product.price === 'number') {
            total += product.price;
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

    /*
    console.log(`Total without discount: ${totalTmp}`);
    console.log(`Discount: ${discountTmp}`);
    console.log(`TOTAL WITH DISCOUNT: ${total}`);
    */
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

// Exercise 9
function removeFromCart(id) {
    // 1. Loop for to the array products to get the item to add to cart
    // 2. Add found product to the cartList array

    // IGNORO LOS COMENTARIOS 1. Y 2.
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
    // 1. Loop for to the array products to get the item to add to cart
    // 2. Add found product to the cartList array

    // IGNORO LOS COMENTARIOS 1. Y 2.
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
    // Fill the shopping cart modal manipulating the shopping cart dom
    applyPromotionsCart();
    calculateSubtotalsCart();
    calculateTotalCart();

    let lista = document.getElementById("lista");
    lista.innerHTML = '';

    cart.forEach(item => {
        let entry = document.createElement('li');

        let texto = `
        <div class="d-flex justify-content-between">
            <h5>${item.name.toUpperCase()}</h5> 
            <h6>Quantity: ${item.quantity}</h6>
        </div>
        
        <div class="d-flex justify-content-end align-items-end"> 
            
            <div class="pl-5">
                <button class="btn btn-secondary" onclick="removeFromCart(${item.id})">-</button>
                <button class="btn btn-secondary" onclick="addFromCart(${item.id})">+</button>
                <button class="btn btn-secondary" onclick="removeElementFromCart(${item.id})"><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>
        `;

        if (item.subtotalWithDiscount > 0) {
            texto += `
            <div class="d-flex justify-content-end align-items-end mt-4"> 
                <div>
                    <div class="d-flex justify-content-between align-items-end mt-4 text-italic">
                        <h6 class="font-italic text-secondary">Subtotal sin descuento:</h6>
                        <h6 class="ml-5 font-italic text-secondary">${item.subtotal} €</h6>
                    </div>
                    <div class="d-flex justify-content-between align-items-end mt-1">
                        <h6 class="font-italic text-success">Descuento:</h6>
                        <h6 class="ml-5 font-italic text-success">${item.subtotal - item.subtotalWithDiscount} €</h6>
                    </div>
                    <div class="d-flex justify-content-between align-items-end mt-1">
                        <h6>Subtotal con descuento:</h6>
                        <h6 class="ml-5">${item.subtotalWithDiscount} €</h6>
                    </div>
                </div>
            </div>
            <br>
            <hr>
            `;
        } else {
            texto += `
            <div class="d-flex justify-content-end align-items-end mt-4 text-italic">
                <h6 class="font-italic text-secondary">Precio unidad:</h6>
                <h6 class="ml-5 font-italic text-secondary">${item.price} €</h6>
            </div>
            <div class="d-flex justify-content-end align-items-end mt-4"> 
                <div>
                    <h5>Subtotal: ${item.subtotal} €</h5>
                </div>
            </div>
            <br>
            <hr>
            `;
        }

        entry.innerHTML = texto;
        lista.appendChild(entry);
    });

    
    let totalCarrito = document.getElementById("total");
    if (total > 0) {
        totalCarrito.innerHTML = `
        <div class="bg-primary text-white d-flex justify-content-between p-2">
            <h4 class="font-weight-bold">TOTAL</h4> 
            <h4 class="font-weight-bold">${total} €</h4>
        </div>
        `;
    } else {
        totalCarrito.innerHTML = `
        <div class="bg-primary text-white d-flex justify-content-center p-2">
            <h4 class="font-weight-bold">Carrito vacio</h4>
        </div>
        `;
    }
    
}

