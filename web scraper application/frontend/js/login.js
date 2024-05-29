document.getElementById("loginForm").addEventListener("submit", function(event){
    event.preventDefault();

    var emailInput = document.getElementById("email");
    var passwordInput = document.getElementById("password");

    var email = emailInput.value;
    var password = passwordInput.value;

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Username and/or Password is wrong");
        }
        return response.json();
    })
    .then(data => {
        var token = data.token;
        localStorage.setItem('token', token);
        console.log("Token:", token);
        window.location.href = 'home.html';
    })
    .catch(error => {
        alert(error.message);
    });
});



