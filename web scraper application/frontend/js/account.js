    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    if (token) {
        // Decode the token to get user information
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userEmail = decodedToken.email;

        // Display the email inside the div with id 'emailId'
        document.getElementById('emailId').innerText = 'Username: ' + userEmail;
        document.getElementById('email-information').innerText = userEmail;


        // Add event listener for the "Delete Account" button
        const deleteAccountBtn = document.getElementById('deleteAccountBtn');
        deleteAccountBtn.addEventListener('click', async () => {

            const confirmation = confirm('Are you sure you want to delete your account?');
            
            if(confirmation){

            try {
                // Make a request to the server to delete the account
                const response = await fetch('http://localhost:3000/deleteAccount', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    // Optionally, you may want to log the user out by removing the token
                    localStorage.removeItem('token');
                    
                    // Redirect to login.html after successful account deletion
                    window.location.href = 'login.html';
                } else {
                    alert('Failed to delete account');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred');
            }

        }
        });
    }


      // Logout button click event
      document.getElementById("logout-button").addEventListener("click", function() {
            // Remove the token from storage
            localStorage.removeItem('token');
            
            // Redirect to login.html
            window.location.href = 'login.html';
        });
















// sidebar 





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




   
