// ⚡ DOM Elements Selection
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const toRegisterLink = document.getElementById('to-register');
const toLoginLink = document.getElementById('to-login');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

const BACKEND_URL = 'http://localhost:5000/api/auth';

// 🔄 VIEW TOGGLES
toRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginSection.classList.add('hidden');
    registerSection.classList.remove('hidden');
});

toLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
});

// 📝 LIVE REGISTRATION SUBMISSION
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;

    try {
        const response = await fetch(`${BACKEND_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, role })
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            registerForm.reset();
            // Automatically kick them to login view
            toLoginLink.click();
        } else {
            alert(`⚠️ Registration Failed: ${data.message}`);
        }
    } catch (error) {
        console.error(error);
        alert('Could not connect to the backend server. Make sure it is running on port 5000!');
    }
});

// 🔑 LIVE LOGIN SUBMISSION
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${BACKEND_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            // Save basic session data locally in the browser
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // For this assignment scope, we can notify success 
            console.log('User Session Stored:', data.user);
        } else {
            alert(`❌ Login Failed: ${data.message}`);
        }
    } catch (error) {
        console.error(error);
        alert('Could not connect to the backend server. Is npm run dev active?');
    }
});
// 👁️ SHOW/HIDE PASSWORD LOGIC
const toggleLoginPass = document.getElementById('toggle-login-pass');
const loginPasswordInput = document.getElementById('login-password');

const toggleRegPass = document.getElementById('toggle-reg-pass');
const regPasswordInput = document.getElementById('reg-password');

// Toggle Login Password Visibility
toggleLoginPass.addEventListener('click', () => {
    if (loginPasswordInput.type === 'password') {
        loginPasswordInput.type = 'text';
        toggleLoginPass.textContent = 'Hide';
    } else {
        loginPasswordInput.type = 'password';
        toggleLoginPass.textContent = 'Show';
    }
});

// Toggle Registration Password Visibility
toggleRegPass.addEventListener('click', () => {
    if (regPasswordInput.type === 'password') {
        regPasswordInput.type = 'text';
        toggleRegPass.textContent = 'Hide';
    } else {
        regPasswordInput.type = 'password';
        toggleRegPass.textContent = 'Show';
    }
});