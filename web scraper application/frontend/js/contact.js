
    document.addEventListener("DOMContentLoaded", function () {
    const contactButton = document.getElementById("contact-button");
    const contactForm = document.getElementById("contact-form");

    contactButton.addEventListener("click", function () {
        const name = document.getElementById("contact-name").value;
        const email = document.getElementById("contact-email").value;
        const message = document.getElementById("contact-data").value;

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3000/sendEmail", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log("Email sent successfully!");
                    alert("Email sent successfully!");

                    //Clear all fields after successful submission
                    contactForm.reset();
                } else {
                    console.error("Error sending email. Please try again later.");
                    alert("Error sending email. Please try again later.");
                }
            }
        };

        const data = JSON.stringify({
            name: name,
            email: email,
            message: message
        });

        xhr.send(data);
    });
});

  







    let menu_icon_box = document.querySelector(".menu_icon_box");
    let box = document.querySelector(".box");
    
    menu_icon_box.onclick = function () {
        menu_icon_box.classList.toggle("active");
        box.classList.toggle("active");
    



        // Disable scrolling when sidebar is active
        if (box.classList.contains("active")) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }


    }
    
    document.onclick = function (e) {
        if (!menu_icon_box.contains(e.target) && !box.contains(e.target)) {
            menu_icon_box.classList.remove("active");
            box.classList.remove("active");
    



            // Enable scrolling when sidebar is inactive
            document.body.style.overflow = "auto";
        }
    }





