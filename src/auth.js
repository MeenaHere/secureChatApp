import jwt from 'jsonwebtoken'

import { question } from 'readline-sync'
import bcrypt from 'bcryptjs'

const salt = bcrypt.genSaltSync(10);

function authenticateUser(username, password) {
    const foundUser = userData.find(user => user.username === username && user.password === password)

    return Boolean(foundUser)
}

function createToken(name) {
    const user = { username: name }
    const token = jwt.sign(user, process.env.SECRET, { expiresIn: '1h' })
    user.token = token
    return user
}

function encryptPassword(pass) {
    let hashedPassword = bcrypt.hashSync(pass, salt)
    let password = { password: hashedPassword }
    return password
}

export { authenticateUser, createToken, encryptPassword }