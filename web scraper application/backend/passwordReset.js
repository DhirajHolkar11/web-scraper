const nodemailer = require('nodemailer');

// Nodemailer transporter setup (replace with your email service credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dhirajspock2121@gmail.com',
    pass: 'adsd cxyy mkaj mhqr'
  }
});

function generateResetCodeAndSendEmail(email, callback) {
  // Generate 6-digit random number
  const randomCode = Math.floor(100000 + Math.random() * 900000);

  // Compose email message
  const mailOptions = {
    from: 'dhirajspock2121@gmail.com',
    to: email,
    subject: 'Password Reset Code',
    text: `Your password reset code is: ${randomCode}`
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      callback(error);
    } else {
      console.log('Email sent:', info.response);
      callback(null, randomCode);
    }
  });
}

module.exports = generateResetCodeAndSendEmail;
