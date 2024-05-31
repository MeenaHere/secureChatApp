// DOM Elements
const elements = {
  // Input fields and buttons for login
  inputUsername: document.querySelector('#username'),
  inputPassword: document.querySelector('#password'),
  signInBtn: document.querySelector('#sign-in-btn'),

  // Input fields and buttons for registration
  registerFirstName: document.querySelector('#r-firstname'),
  registerLastName: document.querySelector('#r-lastname'),
  registerUsername: document.querySelector('#r-username'),
  registerPassword: document.querySelector('#r-password'),
  registerBtn: document.querySelector('#register-btn'),
  registerUserBtn: document.querySelector('#register-user-btn'),

  // Button for signing out
  signoutBtn: document.querySelector('#signout-btn'),

  // Element to display logged-in user's username
  loggedinUsername: document.querySelector('#avatar'),

  // Input field for sending messages
  inputMsg: document.querySelector('#input-message'),

  // Button for sending messages
  sendMsgBtn: document.querySelector('#send-message'),

  // Forms for login and registration
  loginForm: document.querySelector('#login-form'),
  registerForm: document.querySelector('#register-form'),

  // Element for displaying user dashboard after login
  signeddashboard: document.querySelector('#welcome-user'),

  // Element for displaying warning messages
  warningP: document.querySelector('#warning-p'),

  // Element for displaying user greeting
  userGreeting: document.querySelector('.user-greeting'),

  // Element for displaying current channel
  channelHeading: document.querySelector('#channel-heading'),

  // Buttons for different channels
  privateChannel: document.querySelector('#private-channel'),
  generalChannel: document.querySelector('#general-channel'),
  familyChannel: document.querySelector('#family-channel'),

  // All channel buttons
  channels: document.querySelectorAll('.channels'),

  // Element for displaying list of messages
  messageList: document.querySelector('#message-list'),

  // Element for displaying warning tag
  warnPTag: document.querySelector('#warning-tag')
};

// Key for JWT token in local storage
const jwtKey = 'user_jwt';

// Variable to track user login status
let userLogin = false;

// Initial setup
loadMessages("General");
checkUserLoginStatus();

// Event Listeners
elements.signInBtn.addEventListener('click', handleLogin);
elements.signoutBtn.addEventListener('click', handleSignout);
elements.registerUserBtn.addEventListener('click', showRegisterForm);
elements.registerBtn.addEventListener('click', handleRegister);
elements.sendMsgBtn.addEventListener('click', sendMessage);
elements.channels.forEach(channel => channel.addEventListener('click', selectChannel));
window.addEventListener('keydown', e => { if (e.key === "Enter") sendMessage(); });

// Function to handle login
async function handleLogin() {
  // Get username and password from input fields
  const user = {
    username: elements.inputUsername.value,
    password: elements.inputPassword.value
  };

  // Send login request to server
  const response = await fetch('/api/login/', createRequestOptions('POST', user));

  // Process response
  if (response.ok) {
    const userToken = await response.json();
    saveToken(userToken);
    updateUserInterface(user.username);
    openDashboard();
  } else {
    displayWarning(response.status === 401 ? "Invalid password" : "Invalid username and password");
  }
}

// Function to handle sign out
async function handleSignout() {
  localStorage.clear();
  location.reload();
}

// Function to display registration form
function showRegisterForm() {
  elements.registerForm.style.display = "block";
  elements.loginForm.style.display = "none";
}

// Function to handle registration
async function handleRegister() {
  // Get user registration data
  const user = {
    firstName: elements.registerFirstName.value,
    lastName: elements.registerLastName.value,
    username: elements.registerUsername.value,
    password: elements.registerPassword.value
  };

  // Send registration request to server
  const response = await fetch('api/newuser', createRequestOptions('POST', user));

  // Process response
  if (response.ok) {
    const userToken = await response.json();
    saveToken(userToken);
    updateUserInterface(user.username);
    openDashboard();
  } else {
    displayWarning("Please fill all the details first");
  }
}

// Function to display user dashboard after login
function openDashboard() {
  elements.loginForm.style.display = "none";
  elements.registerForm.style.display = "none";
  elements.signeddashboard.style.display = "block";
  enableChannels();
  userLogin = true;
}

// Function to check user login status
async function checkUserLoginStatus() {
  const jwtUser = localStorage.getItem(jwtKey);
  if (!jwtUser) return;

  const token = JSON.parse(jwtUser).token;
  const isTokenExpired = Date.now() > JSON.parse(atob(token.split('.')[1])).exp * 1000;

  if (isTokenExpired) {
    localStorage.removeItem(jwtKey);
    return;
  }

  const response = await fetch('/api/loginwithsecrete', createRequestOptions('POST', null, token));

  if (response.ok) {
    const userData = await response.json();
    updateUserInterface(userData.username);
    openDashboard();
  }
}

// Function to load messages for a specific channel
async function loadMessages(channelName) {
  const response = await fetch(`/api/messages/${channelName}`);
  if (!response.ok) return console.error(`Failed to load messages for ${channelName}`);

  const messages = await response.json();
  displayMessages(messages);
}

// Function to send a message
async function sendMessage() {
  const selectedChannel = document.querySelector(".selected").innerHTML;
  const message = {
    username: elements.loggedinUsername.innerText,
    message: elements.inputMsg.value,
    channelName: selectedChannel,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
  };

   // Send message to server
  const response = await fetch('/api/message/', createRequestOptions('POST', message));
  if (response.ok) {
    // If message sent successfully, reload messages, clear input, and clear warning
    loadMessages(selectedChannel);
    elements.inputMsg.value = '';
    elements.warnPTag.innerHTML = '';
  } else {
    // If message sending failed, display warning
    displayWarning("Message cannot be empty", true);
  }
}

// Function to create request options for fetch
function createRequestOptions(method, body, token = '') {
  return {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    ...(body && { body: JSON.stringify(body) })
  };
}

// Function to display messages in the message list
function displayMessages(messages) {
  elements.messageList.innerHTML = '';
  messages.forEach(msg => {
    // Create message elements and append to message list
    const outerDiv = createElement('div', 'outer');
    const avatarDiv = createElement('div', 'user-avatar', `<p>${msg.username}</p><p>${msg.date}</p><p>${msg.time}</p>`);
    const msgDiv = createElement('div', 'msg-div', msg.message);
    outerDiv.append(avatarDiv, msgDiv);
    elements.messageList.appendChild(outerDiv);
  });
}

// Function to create HTML element
function createElement(tag, className, innerHTML = '') {
  const element = document.createElement(tag);
  element.className = className;
  element.innerHTML = innerHTML;
  return element;
}

// Function to save JWT token to local storage
function saveToken(token) {
  localStorage.setItem(jwtKey, JSON.stringify(token));
}

// Function to update user interface after login
function updateUserInterface(username) {
  elements.loggedinUsername.innerHTML = username;
  elements.userGreeting.innerText = `Signed in as: \n  ${username}`;
}

// Function to enable channels after login
function enableChannels() {
  [elements.privateChannel, elements.familyChannel, elements.sendMsgBtn].forEach(el => el.disabled = false);
}

// Function to display warning message
function displayWarning(msg, isPermanent = false) {
  elements.warningP.style.display = "block";
  elements.warningP.style.color = "red";
  elements.warningP.innerHTML = msg;
  if (!isPermanent) setTimeout(() => elements.warningP.style.display = "none", 3000);
}

// Function to handle channel selection
function selectChannel() {
  if (!userLogin) return;
  document.querySelector(".selected").classList.remove("selected");
  this.classList.add("selected");
  const channelName = this.innerHTML;
  elements.channelHeading.innerHTML = channelName;
  loadMessages(channelName);
}