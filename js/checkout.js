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


// Funciones de uso general para determinar estados de valores
const isNotEmpty = function (valor) {
    return valor.length != 0;
}

const isValidEmail = function (valor) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(valor)) {
        return (true);
    }
    return (false);
}

const isLength = function (valor, index = 3) {
    return valor.length >= index;
}

const hasNumber = function (valor) {
    return /\d/.test(valor);
}

const hasLetter = function (valor) {
    for (var i = 0; i < valor.length; i++) {
        let ascii = valor.toUpperCase().charCodeAt(i);
        if (ascii > 64 && ascii < 91) {
            return true;
        }
    }
    return false;
}

// Modificar estilo input invalido
const setError = function (error, field, text) {
    error.innerHTML = text;
    error.style.display = "inline";
    error.style.color = "lightcoral";
    field.setCustomValidity(text);
}

// Funciones de validación para cada campo
function validarNombre() {
    let thisIsNotEmpty = isNotEmpty(userName.value);
    let thisIsLength = isLength(userName.value);
    let thisHasNumber = hasNumber(userName.value);

    if (thisIsNotEmpty && thisIsLength && !thisHasNumber) {
        userName.setCustomValidity("");
        errorName.style.display = "none";
        return true;
    } else {

        if (!thisIsNotEmpty) {
            setError(errorName, userName, "Empty name");
        }

        else if (!thisIsLength && !thisHasNumber) {
            setError(errorName, userName, "Min 3 characters");
        }

        else if (thisIsLength && thisHasNumber) {
            setError(errorName, userName, "Don't use numbers here");
        }

        else if (!thisIsLength && thisHasNumber) {
            setError(errorName, userName, "Min 3 characters NO NUMBERS");
        }

        else {
            setError(errorName, userName, "Invalid field");
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
        errorLastName.style.display = "none";
        return true;
    } else {

        if (!thisIsNotEmpty) {
            setError(errorLastName, lastName, "Empty last name");
        }

        else if (!thisIsLength && !thisHasNumber) {
            setError(errorLastName, lastName, "Min 3 characters");
        }

        else if (thisIsLength && thisHasNumber) {
            setError(errorLastName, lastName, "Don't use numbers here");
        }

        else if (!thisIsLength && thisHasNumber) {
            setError(errorLastName, lastName, "Min 3 characters NO NUMBERS");
        }

        else {
            setError(errorLastName, lastName, "Invalid field");
        }

        return false;
    }
}

function validarEmail() {
    let thisIsNotEmpty = isNotEmpty(email.value);
    let thisIsLength = isLength(email.value);
    let thisIsEmail = isValidEmail(email.value);

    if (thisIsNotEmpty && thisIsLength && thisIsEmail) {
        email.setCustomValidity("");
        errorEmail.style.display = "none";
        return true;
    } else {

        if (!thisIsNotEmpty) {
            setError(errorEmail, email, "Empty email");
        }

        else if (!thisIsLength && !thisIsEmail) {
            setError(errorEmail, email, "This is not an email")
        }

        else {
            setError(errorEmail, email, "Invalid email")
        }

        return false;
    }
}

function validarAddress() {
    let thisIsNotEmpty = isNotEmpty(address.value);
    let thisIsLength = isLength(address.value);

    if (thisIsNotEmpty && thisIsLength) {
        address.setCustomValidity("");
        errorAddress.style.display = "none";
        return true;
    } else {

        if (!thisIsNotEmpty) {
            setError(errorAddress, address, "Empty address");
        }

        else if (!thisIsLength) {
            setError(errorAddress, address, "Min 3 characters");
        }

        else {
            setError(errorAddress, address, "Invalid field");
        }

        return false;
    }
}

function validarPassword() {
    let thisIsNotEmpty = isNotEmpty(password.value);
    let thisIsLength = isLength(password.value, 4);
    let thisHasMax8 = password.value.length <= 8;
    let thisHasLetter = hasLetter(password.value);
    let thisHasNumber = hasNumber(password.value);

    if (thisIsNotEmpty && thisIsLength && thisHasMax8 && thisHasLetter && thisHasNumber) {
        password.setCustomValidity("");
        errorPassword.style.display = "none";
        return true;
    } else {

        if (!thisIsNotEmpty) {
            setError(errorPassword, password, "Empty password");
        }

        else if (thisIsLength && thisHasLetter && !thisHasNumber) {
            setError(errorPassword, password, "Use letters and NUMBERS TOO");
        }

        else if (thisIsLength && thisHasNumber && !thisHasLetter) {
            setError(errorPassword, password, "Use numbers and LETTERS TOO");
        }

        else if (!thisIsLength && thisHasLetter && thisHasNumber) {
            setError(errorPassword, password, "Min 4 characters");
        }

        else if (!thisIsLength && thisHasLetter && !thisHasNumber) {
            setError(errorPassword, password, "Min 4 characters, with numbers too");
        }

        else if (!thisIsLength && !thisHasLetter && thisHasNumber) {
            setError(errorPassword, password, "Min 4 characters, with letters too");
        }

        else if (!thisHasMax8) {
            setError(errorPassword, password, "Max 8 characters, letters and numbers");
        }

        else {
            setError(errorPassword, password, "Min 4 characters, letters and numbers");
        }

        return false;
    }
}

function validarPhone() {
    let thisIsNotEmpty = isNotEmpty(phone.value);
    let thisIsLength = isLength(phone.value);
    let thisHasLetter = hasLetter(phone.value);
    let thisHasNumber = hasNumber(phone.value);

    if (thisIsNotEmpty && thisIsLength && thisHasNumber && !thisHasLetter) {
        phone.setCustomValidity("");
        errorPhone.style.display = "none";
        return true;
    } else {

        if (!thisIsNotEmpty) {
            setError(errorPhone, phone, "A phone number is required");
        }

        else if (!thisIsLength && thisHasNumber && !thisHasLetter) {
            setError(errorPhone, phone, "Min 3 characteres");
        }

        else {
            setError(errorPhone, phone, "Invalid phone number");
        }

        return false;
    }
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
