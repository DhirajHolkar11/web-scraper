document.getElementById("signupForm").addEventListener("submit", function (event) {
    event.preventDefault();

    var emailInput = document.getElementById("email");
    var passwordInput = document.getElementById("password");
    var confirmPasswordInput = document.getElementById("confirm-password");

    var email = emailInput.value;
    var password = passwordInput.value;
    var confirmPassword = confirmPasswordInput.value;

    if (!validateEmail(email)) {
        alert("Email is not valid");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Signup failed. Please try again.");
        }
        return response.json();
    })
    .then(data => {
        console.log("Signup successful:", data.email);
        // Empty the input fields regardless of success or failure
        emailInput.value = "";
        passwordInput.value = "";
        confirmPasswordInput.value = "";
        window.location.href = 'login.html';
    })
    .catch(error => {
        alert(error.message);
    });
});

function validateEmail(email) {
    var re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
}
