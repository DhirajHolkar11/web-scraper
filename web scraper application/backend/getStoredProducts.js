// productPrice.js
const mongoose = require('mongoose');
const User = require('./User'); // Import the User model


async function getStoredProducts(email) {
  try {
    const user = await User.findOne({ email });
    if (user) {
      const storedProducts = user.productInfoArray;
      return storedProducts;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error retrieving stored products:', error);
    throw error;
  }
}

module.exports = { getStoredProducts };
