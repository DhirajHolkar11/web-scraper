function changePassword() {
  var newPassword = document.getElementById('password').value;
  var confirmPassword = document.getElementById('confirmPassword').value;

  if (newPassword !== confirmPassword) {
    alert('Passwords do not match. Please try again.');
    return;
  }

  // Send request to backend to change password
  var email = sessionStorage.getItem('resetEmail');

  fetch('http://localhost:3000/changePassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: email, password: newPassword })
  })
  .then(response => {
    if (response.ok) {
      alert('Password changed successfully!');
      // Redirect to login page
      window.location.href = 'login.html';
    } else {
      alert('Error changing password. Please try again.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error changing password. Please try again.');
  });
}


