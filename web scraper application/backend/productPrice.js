const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dhirajspock2121@gmail.com', // Replace with your Gmail email address
    pass: 'bwhl oudw kmaz fdgz', // Replace with your Gmail password
  },
});

async function searchFlipkart(productName) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(productName)}`;
  await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

  // Extract product details
  const productDetails = await page.evaluate(() => {
    const firstProduct = document.querySelector('div.yKfJKb.row');
    if (!firstProduct) return null;

    const titleElement = firstProduct.querySelector('div.KzDlHZ');
    const priceElement = firstProduct.querySelector('div.Nx9bqj._4b5DiR');

    if (!titleElement || !priceElement) return null;

    return {
      title: titleElement.innerText.trim(),
      price: priceElement.innerText.trim(),
    };
  });

  await browser.close();

  if (!productDetails) {
    console.error('Failed to extract product details');
  }

  return productDetails;
}

async function getProductsDetails(productArray, userEmail) {
  const productsDetailsArray = [];

  for (const productObj of productArray) {
    const productName = productObj.productName;

    try {
      const flipkartDetails = await searchFlipkart(productName);
      if (
        flipkartDetails &&
        flipkartDetails.title === productName &&
        flipkartDetails.price !== undefined
      ) {
        const flipkartPrice = parseFloat(flipkartDetails.price.replace(/[^0-9.-]+/g, ''));
        const productPrice = parseFloat(productObj.affordablePrice);

        const isPriceLower = flipkartPrice < productPrice;

        const productDetails = {
          productName: productName,
          priceOnFlipkart: flipkartDetails.price,
          isPriceLower: isPriceLower,
        };

        productsDetailsArray.push(productDetails);

        console.log('User Email:', userEmail);
        // If isPriceLower is true, send an email
        if (isPriceLower) {
          sendEmail(userEmail, productName, flipkartDetails.price);
        }
      } else {
        console.error(`Invalid flipkartDetails for ${productName}:`, flipkartDetails);
      }
    } catch (error) {
      console.error(`Error searching Flipkart for ${productName}:`, error);
    }
  }

  return productsDetailsArray;
}

// Function to send email
function sendEmail(userEmail, productName, newPrice) {
  const mailOptions = {
    from: 'dhirajspock2121@gmail.com', // Replace with your Gmail email address
    to: userEmail,
    subject: `Price Drop Alert for ${productName} on Flipkart`,
    text: `The price for ${productName} on Flipkart has dropped to ${newPrice}.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

module.exports = { getProductsDetails };
