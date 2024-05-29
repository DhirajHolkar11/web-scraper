// User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    productInfoArray: [{ type: Object }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
