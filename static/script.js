const inputUsername = document.querySelector('#username')
const inputPassword = document.querySelector('#password')
const signInBtn = document.querySelector('#sign-in-btn')

const jwtKey = 'user_jwt'
let isLoggedIn = false

function updateLoginStatus() {
    signInBtn.disable = isLoggedIn
}

signInBtn.addEventListener('click', async () => {
    //get username and password from input feild 
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

    const response = await fetch('/login', options)


    if (response.status === 200) {
        console.log('Login successful')
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

