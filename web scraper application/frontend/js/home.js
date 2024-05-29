async function searchProducts() {
const query = document.getElementById('searchQuery').value;
const enterProductDiv = document.getElementById('enter-product');
const productInformationDiv = document.getElementById('productInformation');

// Change the text inside 'enter-product' div to 'Collecting information'
enterProductDiv.textContent = 'Collecting information...';
enterProductDiv.style.textAlign = 'center';
enterProductDiv.style.color = 'blue';
enterProductDiv.style.marginTop = '200px';




const response = await fetch('http://localhost:3000/search', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: query })
});

const products = await response.json();
console.log(products);

// Hide 'enter-product' div when data is being displayed
enterProductDiv.style.display = 'none';

// Display the product information
displayProducts(products);
}





function displayProducts(products) {
const container = document.getElementById('productInformation');
container.innerHTML = ''; // Clear existing content

products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product-information-item');
    // productDiv.innerHTML = `<strong>${product.name}</strong> - ${product.price}`;

    const productNameSpan = document.createElement('span');
    productNameSpan.textContent = `Product Name: ${product.name}`;


    productDiv.appendChild(productNameSpan);
    const affordablePriceSpan = document.createElement('span');
    affordablePriceSpan.textContent = `Price: ${product.price}`;
    productDiv.appendChild(affordablePriceSpan);






    // Make each product element clickable
    productDiv.addEventListener('click', () => {
        // Redirect to singleProductInformation.html with the product information
        window.location.href = `oneProduct.html?name=${encodeURIComponent(product.name)}&price=${encodeURIComponent(product.price)}`;
    });

    container.appendChild(productDiv);
});
}






// Retrieve and log the token from browser storage
var storedToken = localStorage.getItem('token');
console.log("Token from Storage:", storedToken);









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



