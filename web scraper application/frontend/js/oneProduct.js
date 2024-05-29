function saveProductInfo() {
    // Retrieve product name from the displayed product information div
    const productName = document.querySelector('#product-information2 .oneProduct-nameSpan').innerText;

    // Retrieve affordable price from the input field
    // const affordablePrice = document.getElementById('affordablePrice').value;

    const affordablePriceInput = document.getElementById('affordablePrice');
    const affordablePrice = affordablePriceInput.value;



    // Create an object with product name and affordable price
    const productInfo = {
        productName,
        affordablePrice,
    };

    // Add the object to an array
    // const productInfoArray = [];
    const productInfoArray = productInfo;

    // productInfoArray.push(productInfo);



    
    // Log the array for testing
    console.log(productInfoArray);

    // Get the token from local storage
    const token = localStorage.getItem('token');

    // Send the product information to the server
    fetch('http://localhost:3000/storeProductInfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productInfo: productInfoArray })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        
        if (result.message === 'Product info stored successfully') {
        
            alert('Data saved successfully');
            
            affordablePriceInput.value = '';

    } else {
        // Handle other cases if needed
        alert('Failed to save data. Please try again.');
    }

        
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

window.onload = function () {
    const productInformationDiv = document.getElementById('product-information2');

    
    const params = new URLSearchParams(window.location.search);
    const productName = params.get('name');
    const productPrice = params.get('price');


    const productNameSpan =document.createElement('span');
    productNameSpan.classList.add('oneProduct-nameSpan');
    productNameSpan.textContent = `${productName}`;
    // productNameSpan.textContent = `Product Name: ${productName}`;
    

    productInformationDiv.appendChild(productNameSpan);


    const affordablePriceSpan = document.createElement('span');
    affordablePriceSpan.classList.add('oneProduct-priceSpan');
    affordablePriceSpan.textContent = `${productPrice}`;
    // affordablePriceSpan.textContent = `Price: ${productPrice}`;
    productInformationDiv.appendChild(affordablePriceSpan);
};










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


