// Get the input fields
var password = document.querySelector(".password");
var phone = document.querySelector('.phone');
var name = document.querySelector('.name');

// Get the error elements
var errorPassword = document.getElementById("errorPassword");
var errorName = document.getElementById('errorName');
var errorPhone = document.getElementById('errorPhone');

// Exercise 8
function validate() {
    // Validate fields entered by the user: name, phone, password, and email

    const email = document.getElementById("mail");

    if (email.validity.typeMismatch) {
        alert("email correcto");
            
        // email.setCustomValidity("¡Se esperaba una dirección de correo electrónico!");
        // email.classList.toggle("is-invalid");
    } else {
        // email.setCustomValidity("");
        // alert("email incorrecto");
        email.classList.toggle("is-invalid");
        email.toggleAttribute("is-invalid");

    }
}