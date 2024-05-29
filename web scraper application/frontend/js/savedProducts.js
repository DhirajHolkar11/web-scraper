const token = localStorage.getItem('token');

    if (token) {
        fetch('http://localhost:3000/getSavedProducts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => response.json())
        .then(savedProducts => {

            const savedProductsDiv = document.getElementById('savedProducts');

            const savedProductsImage = document.getElementById('savedProducts-image');
            const savedProductsInformation = document.getElementById('savedProducts-information');


            if (savedProducts.length > 0) {





                
                
                savedProducts.forEach(product => {
                    
                    const productDiv = document.createElement('div');
                    productDiv.classList.add('savedProducts-item');

                    const productNameSpan = document.createElement('span');
                    productNameSpan.classList.add('productDiv-item1');
                    productNameSpan.textContent = `Product Name: ${product.productName}`;
                    productDiv.appendChild(productNameSpan);

                    const affordablePriceSpan = document.createElement('span');
                    affordablePriceSpan.classList.add('productDiv-item2');
                    affordablePriceSpan.textContent = `Affordable Price: ${product.affordablePrice}`;
                    productDiv.appendChild(affordablePriceSpan);

                    const inputSpan = document.createElement('span');
                    inputSpan.classList.add('productDiv-item3');
                    const inputElement = document.createElement('input');
                    inputElement.type = 'number';
                    inputElement.placeholder = 'Enter new price';

                    const updateButton = document.createElement('button');
                    updateButton.textContent = 'Update Price';
                    updateButton.addEventListener('click', () => updateAffordablePrice(product.productName, inputElement.value));
                    inputSpan.appendChild(inputElement);
                    inputSpan.appendChild(updateButton);
                    productDiv.appendChild(inputSpan);

                    // Add "Remove Product" button
                    const removeButtonSpan = document.createElement('span');
                    removeButtonSpan.classList.add('productDiv-item4');
                    const removeButton = document.createElement('button');
                    removeButton.textContent = 'Remove Product';
                    removeButton.addEventListener('click', () => removeProduct(product.productName));
                    removeButtonSpan.appendChild(removeButton);
                    productDiv.appendChild(removeButtonSpan);


                    savedProductsDiv.appendChild(productDiv);

                });













            }
            else {

                savedProductsImage.style.display = 'block';

                savedProductsInformation.style.display = 'block';

            }

        })
        .catch(error => {
            console.error('Error fetching saved products:', error);
            alert('An error occurred while fetching saved products.');
        });
    }



    function updateAffordablePrice(productName, newAffordablePrice) {
        const token = localStorage.getItem('token');

        if (token) {
            fetch('http://localhost:3000/updateAffordablePrice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productName: productName,
                    newAffordablePrice: newAffordablePrice,
                }),
            })
            .then(response => response.json())
            .then(response => {
                console.log(response.message);
                // Handle success, e.g., show a success message
                if(response.success){
                    location.reload();
                }
            })
            .catch(error => {
                console.error('Error updating affordable price:', error);
                // Handle errors, e.g., show an error message
            });
        }
    }









    function removeProduct(productNameToRemove) {
        const token = localStorage.getItem('token');

    if (token) {
    fetch('http://localhost:3000/removeProduct', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            productNameToRemove: productNameToRemove,
        }),
    })
    .then(response => response.json())
    .then(response => {
        console.log(response.message);
        // Handle success, e.g., show a success message
        if(response.success){
            location.reload();
        }
    })
    .catch(error => {
        console.error('Error removing product:', error);
        // Handle errors, e.g., show an error message
    });
    
}}










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




  

