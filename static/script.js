const inputUsername = document.querySelector('#username')
const inputPassword = document.querySelector('#password')
const warningP = document.querySelector('#warning-p')
const userGreeting = document.querySelector('#user-greeting')
const privateChannel = document.querySelector('#private-channels')

const registerFirstName = document.querySelector('#r-firstname')
const registerLastName = document.querySelector('#r-lastname')
const registerUsername = document.querySelector('#r-username')
const registerPassword = document.querySelector('#r-password')

const signInBtn = document.querySelector('#sign-in-btn')
const registerBtn = document.querySelector('#register-btn')
const registerUserBtn = document.querySelector('#register-user-btn')

const signoutBtn = document.querySelector('#signout-btn')


const loginForm = document.querySelector('#login-form')
const registerForm = document.querySelector('#register-form')
const signeddashboard = document.querySelector('#welcome-user')

const jwtKey = 'user_jwt'

checkedUserLoginStatus()

//need to implement
//const userPass = localStorage.getItem(jwtKey);


async function getUser() {
    //get username and password from input feild 
    const user = {
        username: inputUsername.value,
        password: inputPassword.value
    }

    const checkUsername = user.username === "" && user.username.length < 1
    const checkPassword = user.password === "" && user.password.length < 1

    const options = {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json"
        }
    }

    const response = await fetch('/api/login/', options)


    if (response.status === 200) {

        userGreeting.innerText = `Signed in as: \n  ${user.username}`

        openDashboardAfterLogin()
        //save the user token

        const userToken = await response.json()

        const inString = JSON.stringify(userToken)
        console.log(inString)
        localStorage.setItem(jwtKey, inString)

    } else {
        console.log('Login unsuccessful', response.status)
    }

}

signInBtn.addEventListener('click', getUser)

signoutBtn.addEventListener('click', async () => {
    signeddashboard.style.display = "none"
    loginForm.style.display = "block"
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
        openDashboardAfterLogin()
        userGreeting.innerText = `Signed in as ${user.username}`
        const userToken = await response.json()
        console.log('user token', userToken)
        //save the user token
        localStorage.setItem(jwtKey, userToken.token)
        isLoggedIn = true
    } else {
        console.log('Login unsuccessful', response.status)
    }
    updateLoginStatus()

})

function openDashboardAfterLogin() {
    signeddashboard.style.display = "block"
    loginForm.style.display = "none"
    registerForm.style.display = "none"
}

function checkedUserLoginStatus() {
    const token = localStorage.getItem(jwtKey)

    const inJson = JSON.parse(token)

    if (token) {
        isLoggedIn = true
    } else {
        isLoggedIn = false
    }
}


