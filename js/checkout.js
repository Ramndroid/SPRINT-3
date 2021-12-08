// Get the input fields
var userName = document.getElementById('username');
var lastName = document.getElementById('userlastname');
var email = document.getElementById('useremail');
var address = document.getElementById('useraddress');
var password = document.getElementById('userpassword');
var phone = document.getElementById('userphone');

// Get the error elements
var errorName = document.getElementById('errorName');
var errorLastName = document.getElementById('errorLastName');
var errorEmail = document.getElementById('errorEmail');
var errorAddress = document.getElementById('errorAddress');
var errorPassword = document.getElementById('errorPassword');
var errorPhone = document.getElementById('errorPhone');

// Listeners
userName.addEventListener('input', validarNombre);
lastName.addEventListener('input', validarLastName);
email.addEventListener('input', validarEmail);
address.addEventListener('input', validarAddress);
password.addEventListener('input', validarPassword);
phone.addEventListener('input', validarPhone);

// Constantes
const displayError = "inline";
const displayErrorColor = "lightcoral";
const displayNone = "none";

// Funciones de uso general para determinar estados de valores
function isNotEmpty(valor) {
    return valor.length != 0;
}

function isLength(valor, index = 3) {
    return valor.length >= index;
}

function hasNumber(valor) {
    return /\d/.test(valor);
}

function hasLetter(valor) {
    let ascii = valor.toUpperCase().charCodeAt(0);
    return ascii > 64 && ascii < 91;
}

// Funciones de validación para cada campo
function validarNombre() {
    let thisIsNotEmpty = isNotEmpty(userName.value);
    let thisIsLength = isLength(userName.value);
    let thisHasNumber = hasNumber(userName.value);

    if (thisIsNotEmpty && thisIsLength && !thisHasNumber) {
        userName.setCustomValidity("");
        errorName.style.display = displayNone;
        return true;
    } else {

        if (!thisIsNotEmpty) {
            errorName.style.display = displayNone;
            userName.setCustomValidity("Empty field!");
        }

        else if (!thisIsLength && !thisHasNumber) {
            errorName.style.display = displayNone;
            userName.setCustomValidity("Min 3 characters!");
        }

        else if (thisIsLength && thisHasNumber) {
            errorName.style.display = displayError;
            errorName.style.color = displayErrorColor;
            userName.setCustomValidity("Don't use numbers here!");
        }

        else if (!thisIsLength && thisHasNumber) {
            errorName.style.display = displayError;
            errorName.style.color = displayErrorColor;
            userName.setCustomValidity("Min3 characters NO NUMBERS!");
        }

        else {
            errorName.style.display = displayNone;
            userName.setCustomValidity("Invalid field");
        }

        return false;
    }
}

function validarLastName() {
    let thisIsNotEmpty = isNotEmpty(lastName.value);
    let thisIsLength = isLength(lastName.value);
    let thisHasNumber = hasNumber(lastName.value);

    if (thisIsNotEmpty && thisIsLength && !thisHasNumber) {
        lastName.setCustomValidity("");
        errorLastName.style.display = displayNone;
        return true;
    } else {

        if (!thisIsNotEmpty) {
            errorLastName.style.display = displayNone;
            lastName.setCustomValidity("Empty field!");
        }

        else if (!thisIsLength && !thisHasNumber) {
            errorLastName.style.display = displayNone;
            lastName.setCustomValidity("Min 3 characters!");
        }

        else if (thisIsLength && thisHasNumber) {
            errorLastName.style.display = displayError;
            errorLastName.style.color = displayErrorColor;
            lastName.setCustomValidity("Don't use numbers here!");
        }

        else if (!thisIsLength && thisHasNumber) {
            errorLastName.style.display = displayError;
            errorLastName.style.color = displayErrorColor;
            lastName.setCustomValidity("Min3 characters NO NUMBERS!");
        }

        else {
            errorLastName.style.display = displayNone;
            lastName.setCustomValidity("Invalid field");
        }

        return false;
    }
}

function validarEmail() {

    function isValidEmail(valor) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(valor)) {
            // email.setCustomValidity("");
            return (true);
        }
        // email.setCustomValidity("Invalid email!");
        return (false);
    }

    let thisIsNotEmpty = isNotEmpty(email.value);
    let thisIsLength = isLength(email.value);
    let thisIsEmail = isValidEmail(email.value);

    
}

function validarAddress() {
    let thisIsNotEmpty = isNotEmpty(address.value);
    let thisIsLength = isLength(address.value);

    if (thisIsNotEmpty && thisIsLength) {
        address.setCustomValidity("");
        errorAddress.style.display = displayNone;
        return true;
    } else {

        if (!thisIsNotEmpty) {
            errorAddress.style.display = displayNone;
            address.setCustomValidity("Empty field!");
        }

        else if (!thisIsLength) {
            errorAddress.style.display = displayNone;
            address.setCustomValidity("Min 3 characters!");
        }

        else {
            errorAddress.style.display = displayNone;
            address.setCustomValidity("Invalid field");
        }

        return false;
    }

}

function validarPassword() {
    let thisIsNotEmpty = isNotEmpty(password.value);
    let thisIsLength = isLength(password.value, 4);
    let thisHasLetter = hasLetter(password.value);
    let thisHasNumber = hasNumber(password.value);

    if (thisIsNotEmpty && thisIsLength && thisHasLetter && thisHasNumber) {
        password.setCustomValidity("");
        errorPassword.style.display = displayNone;
        return true;
    } else {

        if (!thisIsNotEmpty) {
            errorPassword.style.display = displayNone;
            password.setCustomValidity("Empty password!");
        }

        else if (thisIsLength && thisHasLetter && !thisHasNumber) {
            errorPassword.style.display = displayError;
            errorPassword.style.color = displayErrorColor;
            password.setCustomValidity("Use letters and NUMBERS TOO!");
        }

        else if (thisIsLength && !thisHasLetter && thisHasNumber) {
            errorPassword.style.display = displayError;
            errorPassword.style.color = displayErrorColor;
            password.setCustomValidity("Use numbers and LETTERS TOO!");
        }

        else if (!thisIsLength && thisHasLetter && thisHasNumber) {
            errorPassword.style.display = displayNone;
            password.setCustomValidity("Min 4 characters!");
        }

        else if (!thisIsLength && thisHasLetter && !thisHasNumber) {
            errorPassword.style.display = displayNone;
            password.setCustomValidity("Min 4 characters, with numbers too!");
        }

        else if (!thisIsLength && !thisHasLetter && thisHasNumber) {
            errorPassword.style.display = displayNone;
            password.setCustomValidity("Min 4 characters, with letters too!");
        }
        

        else {
            errorPassword.style.display = displayNone;
            password.setCustomValidity("Min 4 characters, letters and numbers!");
        }

        return false;
    }
}

function validarPhone() {

}

// Exercise 8
function validate() {
    // Validate fields entered by the user: name, phone, password, and email
    validarNombre();
    validarLastName();
    validarEmail();
    validarAddress();
    validarPassword();
    validarPhone();
}
