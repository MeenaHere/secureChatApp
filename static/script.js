//login user's elements
const inputUsername = document.querySelector('#username')
const inputPassword = document.querySelector('#password')
const signInBtn = document.querySelector('#sign-in-btn')

//register user elements
const registerFirstName = document.querySelector('#r-firstname')
const registerLastName = document.querySelector('#r-lastname')
const registerUsername = document.querySelector('#r-username')
const registerPassword = document.querySelector('#r-password')
const registerBtn = document.querySelector('#register-btn')
const registerUserBtn = document.querySelector('#register-user-btn')

//after login dashbord elements
const signoutBtn = document.querySelector('#signout-btn')
const loggedinUsername = document.querySelector('#avatar')
let inputMsg = document.querySelector('#input-message')
const sendMsgBtn = document.querySelector('#send-message')

const loginForm = document.querySelector('#login-form')
const registerForm = document.querySelector('#register-form')
const signeddashboard = document.querySelector('#welcome-user')
const avatar = document.querySelector('.msg-avatar')

const warningP = document.querySelector('#warning-p')
const warnTag = document.querySelector("#warn")
const userGreeting = document.querySelector('.user-greeting')
//channels
const channelHeading = document.querySelector('#channel-heading')
const privateChannel = document.querySelector('#private-channel')
const generalChannel = document.querySelector('#general-channel')
const familyChannel = document.querySelector('#family-channel')

const channels = document.querySelectorAll('.channels')
const messageList = document.querySelector('#message-list')
const msgOuterDiv = document.querySelector('.outer')
const userAvatar = document.querySelector('.user-avatar')
const msg = document.querySelector('.msg')
const warnPTag = document.querySelector('#warning-tag')
const jwtKey = 'user_jwt'
let userLogin = false

getMessage("General")

const jwtUser = localStorage.getItem('user_jwt');
if (jwtUser !== null) {
    const token = JSON.parse(jwtUser).token
    //decode the token to check expiation time
    const decodedToken = JSON.parse(window.atob(token.split('.')[1]))
    const expirationTime = decodedToken.exp * 1000;
    if (Date.now() < expirationTime) {
        checkedUserLoginStatus(token)
    }
    else {
        // Remove expired token from local storage
        localStorage.removeItem('user_jwt');
    }
}

async function getUser() {
    //get username and password from input field 
    const user = {
        username: inputUsername.value,
        password: inputPassword.value
    }

    const options = {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json"
        }
    }

    const response = await fetch('/api/login/', options)

    if (response.status === 200) {

        loggedinUsername.innerHTML = user.username
        userGreeting.innerText = `Signed in as: \n  ${user.username}`

        generalChannel.classList.add("selected")
        const selectedChannel = document.querySelector('.selected')
        getMessage(selectedChannel.innerHTML)
        channelHeading.innerHTML = selectedChannel.innerHTML
        openDashboardAfterLogin()
        //save the user token
        const userToken = await response.json()
        const inString = JSON.stringify(userToken)
        console.log(inString)
        localStorage.setItem(jwtKey, inString)
        window.location.reload();
    }
    else if (response.status === 401) {
        inputUsername.style.border = "2px solid red"
        inputPassword.style.border = "2px solid red"
        displayWarningMsg("Enter a valid password")
    }
    else {
        inputUsername.style.border = "2px solid red"
        inputPassword.style.border = "2px solid red"
        displayWarningMsg("Enter a valid username and password")
    }
}

signInBtn.addEventListener('click', getUser)

signoutBtn.addEventListener('click', async () => {
    signeddashboard.style.display = "none"
    loginForm.style.display = "block"
    localStorage.clear()
    window.location.reload();
})

registerUserBtn.addEventListener('click', async () => {
    registerForm.style.display = "block"
    loginForm.style.display = "none"
})


registerBtn.addEventListener('click', async () => {
    //get username and password from input feild 
    const user = {
        firstName: registerFirstName.value,
        lastName: registerLastName.value,
        username: registerUsername.value,
        password: registerPassword.value
    }

    const options = {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json"
        }
    }

    const response = await fetch('api/newuser', options)

    if (response.status === 200) {

        loggedinUsername.innerHTML = user.username
        userGreeting.innerText = `Signed in as: \n  ${user.username}`
        generalChannel.classList.add("selected")
        const selectedChannel = document.querySelector('.selected')
        getMessage(selectedChannel.innerHTML)
        channelHeading.innerHTML = selectedChannel.innerHTML
        openDashboardAfterLogin()
        const userToken = await response.json()
        const inString = JSON.stringify(userToken)
        console.log(inString)
        localStorage.setItem(jwtKey, inString)
        openDashboardAfterLogin()
        window.location.reload();

        isLoggedIn = true
    } else {
        displayWarningMsg("Please fill all the details first")
    }

})

function openDashboardAfterLogin() {
    loginForm.style.display = "none"
    registerForm.style.display = "none"
    signeddashboard.style.display = "block"
    privateChannel.disabled = false
    familyChannel.disabled = false
    sendMsgBtn.disabled = false
    userLogin = true
}

async function checkedUserLoginStatus(token) {

    let userData = null

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }
    const response = await fetch('/api/loginwithsecrete', options)

    userData = await response.json()

    if (response.status === 200) {

        loggedinUsername.innerHTML = userData.username
        userGreeting.innerText = `Signed in as: \n  ${userData.username}`

        generalChannel.classList.add("selected")
        const selectedChannel = document.querySelector('.selected')
        channelHeading.innerHTML = selectedChannel.innerHTML
        getMessage(selectedChannel.innerHTML)
        userLogin = true
        openDashboardAfterLogin()

    } else {
        console.log('Something is wrong! status=', response.status)
    }

}

async function getMessage(channelName) {

    let messageData = ""
    try {
        const response = await fetch(`/api/messages/${channelName}`)
        if (response.status !== 200) {
            console.log('Could not contact server. Status: ' + response.status)
            return
        }
        messageData = await response.json()

    } catch (error) {
        console.log('Something went wrong when fetching data from server. (GET) \n' + error.message)
        return
    }

    messageList.innerHTML = ""
    messageData.forEach(message => {
        const msgBtn = document.createElement('div')
        const outerDiv = document.createElement('div')
        const msgDiv = document.createElement('div')
        const avatarDiv = document.createElement('div')
        const avatar = document.createElement('p')
        const datep = document.createElement('p')
        const timep = document.createElement('p')
        avatar.innerHTML = `${message.username}`
        datep.innerText = `${message.date}`
        timep.innerText = `${message.time}`
        msgDiv.classList.add('msg-div')
        avatarDiv.classList.add('user-avatar')
        avatar.classList.add('avatar')
        msgBtn.classList.add('msg-btn')
        avatarDiv.appendChild(avatar)
        avatarDiv.appendChild(datep)
        avatarDiv.appendChild(timep)
        outerDiv.classList.add('outer')
        msgDiv.innerHTML = `${message.message}.`
        outerDiv.appendChild(avatarDiv)
        outerDiv.appendChild(msgDiv)
        outerDiv.appendChild(msgBtn)
        messageList.appendChild(outerDiv)
    })
}

async function sendMessage() {
    let selectedChannel = document.querySelector(".selected")
    let date = new Date()
    let dateInString = date.toLocaleDateString()
    const timeInString = date.toLocaleTimeString()
    const user = {
        username: loggedinUsername.innerText,
        message: inputMsg.value,
        channelName: selectedChannel.innerHTML,
        date: dateInString,
        time: timeInString
    }

    const options = {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json",
        }
    }
    try {
        const response = await fetch('/api/message/', options)

        if (response.status === 200) {
            getMessage(user.channelName)
            inputMsg.value = ''
            warnPTag.innerHTML = ''
        } else {
            warnPTag.style.color = "red"
            warnPTag.innerHTML = "Message cant be empty"
        }

    } catch (error) {
        warnPTag.style.color = "red"
        warnPTag.innerHTML = `Something went wrong when fetching data from server. (GET) \n  ${error.message}`
        return
    }
}

sendMsgBtn.addEventListener('click', sendMessage)

for (const channel of channels) {
    channel.addEventListener('click', async () => {
        if (userLogin == true) {
            let selectedChannel = document.querySelector(".selected")
            selectedChannel.classList.remove("selected")
            channel.classList.add("selected")

            const channelName = channel.innerHTML
            channelHeading.innerHTML = channelName
            getMessage(channelName)
        }
    })
}

function displayWarningMsg(msg) {
    warningP.style.display = "block"
    warningP.style.color = "red"
    warningP.innerHTML = msg
}

window.addEventListener('keydown', e => {
    if (e.key == "Enter") {
        sendMessage()
    }
})