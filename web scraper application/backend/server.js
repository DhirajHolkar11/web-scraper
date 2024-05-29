const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const getProductData = require('./getProductData'); // Import oneProduct.js
const User = require('./User');
const getStoredProducts = require('./getStoredProducts');//import productPrice.js
const productPrice = require('./productPrice');//import getProduct.js
const cron = require('node-cron');
const {sendEmail} = require('./email');
const session = require('express-session');
const generateResetCodeAndSendEmail = require('./passwordReset');
const app = express();


app.use(bodyParser.json());
app.use(cors());




app.use(session({
    secret: 'sabrina', // Change this to a secure secret key
    resave: false,
    saveUninitialized: true
  }));



// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/storageSystem', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(error => {
        console.error('MongoDB connection error:', error);
    });

app.options('/signup', cors());
app.options('/login', cors());






app.post('/signup', cors(), async (req, res) => {
    const email = req.body.email;
    const plainPassword = req.body.password;

    try {
        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(400).json({ error: 'User with this email already exists' });
        } else {
            // Hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

            const newUser = new User({
                email: email,
                password: hashedPassword, // Store the hashed password
            });

            newUser.save()
                .then(user => res.json(user))
                .catch(err => res.status(400).json({ error: 'Error creating user' }));
        }
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});









// Function to perform tasks every 24 hours
async function performTasks() {
    console.log('Executing tasks every 24 hours');
  
    try {
      const users = await User.find(); // Fetch all users
      for (const user of users) {
        const userEmail = user.email;
  
        try {
          const storedProducts = await getStoredProducts.getStoredProducts(userEmail);
          const productsDetailsArray = await productPrice.getProductsDetails(storedProducts, userEmail);
          console.log('Products Details Array for User:', userEmail, productsDetailsArray);
        } catch (error) {
          console.error('Error getting products details for User:', userEmail, error);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
  
  // Schedule cron job to run every day at a specific time (e.g., midnight)

//   cron.schedule('0 0 * * *', performTasks);
  cron.schedule('* * * * *', performTasks);
  




















app.get('/getProductsDetails', cors(), async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'sab10');

    if (decodedToken) {
        const userEmail = decodedToken.email;

        try {
            const storedProducts = await getStoredProducts.getStoredProducts(userEmail);

            // Pass the userEmail when calling getProductsDetails
            const productsDetailsArray = await productPrice.getProductsDetails(storedProducts, userEmail);

            console.log('Products Details Array:', productsDetailsArray);
            res.status(200).json(productsDetailsArray);
        } catch (error) {
            console.error('Error getting products details:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});












app.get('/getStoredProducts', cors(), async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'sab10');

    if (decodedToken) {
        const userEmail = decodedToken.email;

        try {
            const storedProducts = await getStoredProducts.getStoredProducts(userEmail);
            console.log('Stored Products:', storedProducts);
            res.status(200).json(storedProducts);
        } catch (error) {
            console.error('Error getting stored products:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});















app.post('/login', cors(), async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user) {
            // Compare the provided password with the stored hashed password
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                const token = jwt.sign({ email: user.email }, 'sab10');
                console.log("JWT Token:", token);

                try {
                    res.status(200).json({ token });
                } catch (error) {
                    console.error('Error fetching products details:', error);
                    res.status(500).json({ error: 'Internal server error' });
                }
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
















app.post('/search', cors(), async (req, res) => {
    const searchQuery = req.body.query;
    try {
        const result = await getProductData.runPuppeteer(searchQuery);
        console.log("Result:", result);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send(error.toString());
    }
});
















app.post('/storeProductInfo', cors(), (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'sab10');

    if (decodedToken) {
        const userEmail = decodedToken.email;
        const newProductInfo = req.body.productInfo;

        User.findOneAndUpdate(
            { email: userEmail },
            { $push: { productInfoArray: newProductInfo } },
            { new: true }
        )
            .then(updatedUser => {
                res.status(200).json({ message: 'Product info stored successfully' });
            })
            .catch(error => {
                console.error('Error storing product info:', error);
                res.status(500).json({ error: 'Internal server error' });
            });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});













app.post('/deleteAccount', cors(), async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'sab10');

    if (decodedToken) {
        const userEmail = decodedToken.email;

        try {
            // Delete the user's document from the database
            await User.deleteOne({ email: userEmail });

            // Optionally, you may want to log the user out by invalidating the token
            // (e.g., remove the token from localStorage or expire it on the server)

            res.status(200).json({ message: 'Account deleted successfully' });
        } catch (error) {
            console.error('Error deleting account:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});




















app.get('/getSavedProducts', cors(), async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'sab10');

    if (decodedToken) {
        const userEmail = decodedToken.email;

        try {
            const user = await User.findOne({ email: userEmail });
            if (user && user.productInfoArray) {
                res.status(200).json(user.productInfoArray);
            } else {
                res.status(404).json({ error: 'No saved products found' });
            }
        } catch (error) {
            console.error('Error getting saved products:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});














app.post('/updateAffordablePrice', cors(), async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'sab10');

    if (decodedToken) {
        const userEmail = decodedToken.email;
        const productName = req.body.productName;
        const newAffordablePrice = req.body.newAffordablePrice;

        try {
            const user = await User.findOne({ email: userEmail });
            if (user && user.productInfoArray) {
                // Find the product in the productInfoArray and update the affordablePrice
                const updatedProduct = user.productInfoArray.find(product => product.productName === productName);
                if (updatedProduct) {
                    // Use $set to update the affordablePrice field
                    await User.findOneAndUpdate(
                        { email: userEmail, 'productInfoArray.productName': productName },
                        { $set: { 'productInfoArray.$.affordablePrice': newAffordablePrice } }
                    );
                    res.status(200).json({ success: true, message: 'Affordable price updated successfully' });
                } else {
                    res.status(404).json({ error: 'Product not found' });
                }
            } else {
                res.status(404).json({ error: 'User or productInfoArray not found' });
            }
        } catch (error) {
            console.error('Error updating affordable price:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});














app.post('/removeProduct', cors(), async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'sab10');

    if (decodedToken) {
        const userEmail = decodedToken.email;
        const productNameToRemove = req.body.productNameToRemove;

        try {
            const user = await User.findOne({ email: userEmail });
            if (user && user.productInfoArray) {
                // Filter out the product to be removed from the productInfoArray
                user.productInfoArray = user.productInfoArray.filter(product => product.productName !== productNameToRemove);

                // Save the updated user document
                await user.save();

                res.status(200).json({ success: true, message: 'Product removed successfully' });
            } else {
                res.status(404).json({ error: 'User or productInfoArray not found' });
            }
        } catch (error) {
            console.error('Error removing product:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});









app.post('/sendEmail', cors(), (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;

    sendEmail(name, email, message);

    res.status(200).json({ message: 'Email sent successfully' });
});













// Route to generate reset code and send email
app.post('/generateResetCode', (req, res) => {
    const { email } = req.body;
  
    generateResetCodeAndSendEmail(email, (error, randomCode) => {
      if (error) {
        res.status(500).send('Error sending email');
      } else {
        // Store email and verification code in session storage
        req.session.resetEmail = email;
        req.session.verificationCode = randomCode;
  
        res.json({ code: randomCode });
      }
    });
  });




















  app.post('/changePassword', cors(), async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            // User not found
            return res.status(404).json({ error: 'User not found' });
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        // Password changed successfully
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


  






app.listen(3000, () => {
    console.log('Server is running on port 3000');
});








