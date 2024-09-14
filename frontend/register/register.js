document.addEventListener("DOMContentLoaded", function() {
    const form = {
        confirmPassword: () => document.getElementById('confirmPassword'),
        confirmPasswordDoesntMatchError: () => document.getElementById('password-doesnt-match-error'),
        email: () => document.getElementById('email'),
        emailInvalidError: () => document.getElementById('email-invalid-error'),
        emailRequiredError: () => document.getElementById('email-required-error'),
        password: () => document.getElementById('password'),
        passwordMinLengthError: () => document.getElementById('password-min-length-error'),
        passwordRequiredError: () => document.getElementById('password-required-error')
    };

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            window.location.href = '../pages/home/home.html';
        }
    });

    function onChangeEmail() {
        const email = form.email().value;
        form.emailRequiredError().style.display = email ? 'none' : 'block';
        form.emailInvalidError().style.display = validateEmail(email) ? 'none' : 'block';
        toggleRegisterButton();
    }

    function onChangePassword() {
        const password = form.password().value;
        form.passwordRequiredError().style.display = password ? 'none' : 'block';
        form.passwordMinLengthError().style.display = password.length >= 6 ? 'none' : 'block';
        toggleRegisterButton();
    }

    function onChangeConfirmPassword() {
        const password = form.password().value;
        const confirmPassword = form.confirmPassword().value;
        form.confirmPasswordDoesntMatchError().style.display = password == confirmPassword ? 'none' : 'block';
        toggleRegisterButton();
    }

    function register() {
        showLoading();

        const email = form.email().value;
        const password = form.password().value;
        firebase.auth().createUserWithEmailAndPassword(
            email, password
        ).then(() => {
            hideLoading();
            window.location.href = '/pages/home/home.html';
        }).catch(error => {
            hideLoading();
            alert(getErrorMessage(error));
        });
    }

    function getErrorMessage(error) {
        if (error.code === 'auth/email-already-in-use') {
            return 'Email ja está em uso!';
        }
        return error.message;
    }

    function toggleRegisterButton() {
        const emailValid = form.email().value && validateEmail(form.email().value);
        const passwordValid = form.password().value && form.password().value.length >= 6;
        const passwordsMatch = form.password().value === form.confirmPassword().value;

        const allValid = emailValid && passwordValid && passwordsMatch;
        document.getElementById('registerButton').disabled = !allValid;
    }

    window.onChangeEmail = onChangeEmail;
    window.onChangePassword = onChangePassword;
    window.onChangeConfirmPassword = onChangeConfirmPassword;
    window.register = register;
});