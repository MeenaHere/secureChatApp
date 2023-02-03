import jwt from 'jsonwebtoken'

import { question } from 'readline-sync'
import bcrypt from 'bcryptjs'


const salt = bcrypt.genSaltSync(10);
console.log('Starting service... salt is ', salt)


function authenticateUser(username, password) {
    const foundUser = userData.find(user => user.username === username && user.password === password)

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


function encryptPassword(pass) {
    let hashedPassword = bcrypt.hashSync(pass, salt)
    let password = { password: hashedPassword }
    console.log(password)
    return password
}


export { authenticateUser, createToken, encryptPassword }