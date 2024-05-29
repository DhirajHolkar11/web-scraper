// email.js
const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {

        user: 'dhirajspock2121@gmail.com', // Update with your Gmail email

        pass: 'bwhl oudw kmaz fdgz' // Update with your Gmail password
    }
});

function sendEmail(name, email, message) {

    const mailOptions = {

        from: email,
        to: 'dhirajspock2121@gmail.com',
        subject: 'Contact Form Submission',
        text: `Hello ${name},\n\nThank you for contacting us!\n\nYour message:\n${message}`
        
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

module.exports = { sendEmail };
