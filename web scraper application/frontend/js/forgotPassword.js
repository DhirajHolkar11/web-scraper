function sendResetEmail() {
  var email = document.getElementById('email').value;

  // Send email to backend to generate verification code
  fetch('http://localhost:3000/generateResetCode', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: email })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Verification code received:', data.code);
    // Store email and verification code in session storage
    sessionStorage.setItem('resetEmail', email);
    sessionStorage.setItem('verificationCode', data.code);

    // Hide email form and display number form
    // document.getElementById('emailForm').style.display = 'none';
    // document.getElementById('numberForm').style.display = 'block';
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function verifyCode() {
  var enteredCode = document.getElementById('verificationCode').value;
  var storedCode = sessionStorage.getItem('verificationCode');

  if (enteredCode === storedCode) {
    // alert('Verification successful! Redirecting to password reset page...');

    window.location.href = 'changePassword.html';
    // Redirect to password reset page
    // window.location.href = 'passwordReset.html';
  } else {
    alert('Incorrect OTP. Please try again.');
  }
}
