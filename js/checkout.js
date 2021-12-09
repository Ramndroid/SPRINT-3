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

// Modificar estilo input inválido
const setError = function (error, field, text) {
    error.innerHTML = text;
    error.style.display = "inline";
    error.style.color = "lightcoral";
    field.setCustomValidity(text);
    return false;
}

// Modificar estilo input válido
const setValid = function (error, field) {
    field.setCustomValidity("");
    error.style.display = "none";
    return true;
}

// Funciones de validación para cada campo
function validarNombre() {
    let thisIsNotEmpty = isNotEmpty(userName.value);
    let thisIsLength = isLength(userName.value);
    let thisHasNumber = hasNumber(userName.value);

    if (thisIsNotEmpty && thisIsLength && !thisHasNumber)
        return setValid(errorName, userName);

    else {
        let answer = '';

        if (!thisIsNotEmpty)
            answer = "Empty name";

        else if (!thisIsLength && !thisHasNumber)
            answer = "Min 3 characters";

        else if (thisIsLength && thisHasNumber)
            answer = "Don't use numbers here";

        else if (!thisIsLength && thisHasNumber)
            answer = "Min 3 characters NO NUMBERS";

        else
            answer = "Invalid field";

        return setError(errorName, userName, answer);
    }
}

function validarLastName() {
    let thisIsNotEmpty = isNotEmpty(lastName.value);
    let thisIsLength = isLength(lastName.value);
    let thisHasNumber = hasNumber(lastName.value);

    if (thisIsNotEmpty && thisIsLength && !thisHasNumber)
        return setValid(errorLastName, lastName);

    else {
        let answer = '';

        if (!thisIsNotEmpty)
            answer = "Empty last name";

        else if (!thisIsLength && !thisHasNumber)
            answer = "Min 3 characters";

        else if (thisIsLength && thisHasNumber)
            answer = "Don't use numbers here";

        else if (!thisIsLength && thisHasNumber)
            answer = "Min 3 characters NO NUMBERS";

        else
            answer = "Invalid field";

        return setError(errorLastName, lastName, answer);
    }
}

function validarEmail() {
    let thisIsNotEmpty = isNotEmpty(email.value);
    let thisIsLength = isLength(email.value);
    let thisIsEmail = isValidEmail(email.value);

    if (thisIsNotEmpty && thisIsLength && thisIsEmail)
        return setValid(errorEmail, email);

    else {
        let answer = '';

        if (!thisIsNotEmpty)
            answer = "Empty email";

        else if (!thisIsLength && !thisIsEmail)
            answer = "This is not an email";

        else
            answer = "Invalid email";

        return setError(errorEmail, email, answer);
    }
}

function validarAddress() {
    let thisIsNotEmpty = isNotEmpty(address.value);
    let thisIsLength = isLength(address.value);

    if (thisIsNotEmpty && thisIsLength)
        return setValid(errorAddress, address);

    else {
        let answer = '';

        if (!thisIsNotEmpty)
            answer = "Empty address";

        else if (!thisIsLength)
            answer = "Min 3 characters";

        else
            answer = "Invalid field";

        return setError(errorAddress, address, answer);
    }
}

function validarPassword() {
    let thisIsNotEmpty = isNotEmpty(password.value);
    let thisIsLength = isLength(password.value, 4);
    let thisHasMax8 = password.value.length <= 8;
    let thisHasLetter = hasLetter(password.value);
    let thisHasNumber = hasNumber(password.value);

    if (thisIsNotEmpty && thisIsLength && thisHasMax8
        && thisHasLetter && thisHasNumber)
        return setValid(errorPassword, password);

    else {
        let answer = '';

        if (!thisIsNotEmpty) answer = "Empty password";

        else if (thisIsLength && thisHasLetter && !thisHasNumber)
            answer = "Use letters and NUMBERS TOO";

        else if (thisIsLength && thisHasNumber && !thisHasLetter)
            answer = "Use numbers and LETTERS TOO";

        else if (!thisIsLength && thisHasLetter && thisHasNumber)
            answer = "Min 4 characters";

        else if (!thisIsLength && thisHasLetter && !thisHasNumber)
            answer = "Min 4 characters, with numbers too";

        else if (!thisIsLength && !thisHasLetter && thisHasNumber)
            answer = "Min 4 characters, with letters too";

        else if (!thisHasMax8)
            answer = "Max 8 characters, letters and numbers";

        else
            answer = "Min 4 characters, letters and numbers";

        return setError(errorPassword, password, answer);
    }
}

function validarPhone() {
    let thisIsNotEmpty = isNotEmpty(phone.value);
    let thisIsLength = isLength(phone.value);
    let thisHasLetter = hasLetter(phone.value);
    let thisHasNumber = hasNumber(phone.value);

    if (thisIsNotEmpty && thisIsLength && thisHasNumber && !thisHasLetter)
        return setValid(errorPhone, phone);
    
    else {
        let answer = '';

        if (!thisIsNotEmpty)
            answer = "A phone number is required";

        else if (!thisIsLength && thisHasNumber && !thisHasLetter)
            answer = "Min 3 characteres";

        else
            answer = "Invalid phone number";

        return setError(errorPhone, phone, answer);
    }
}

// Exercise 8
function validate() {
    validarNombre();
    validarLastName();
    validarEmail();
    validarAddress();
    validarPassword();
    validarPhone();
}
