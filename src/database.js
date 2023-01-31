import jwt from 'jsonwebtoken'

const userData = [
    { username: 'Meena', password: 'meena123' }
]

function authenticateUser(userName, password) {
    const foundUser = userData.find(user => user.username === userName && user.password === password)

    return Boolean(foundUser)
}


function createToken(name) {
    const user = { username: name }
    const token = jwt.sign(user, process.env.SECRET, { expiresIn: '2h' })
    user.token = token
    console.log(user, token)

    console.log('jwtuser: ', user)
    return user
}


export { authenticateUser, createToken }