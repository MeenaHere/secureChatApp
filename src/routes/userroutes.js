import express from 'express'
import { isValidData } from '../validate.js'

import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { encryptPassword, createToken } from '../auth.js'
import bcrypt from 'bcryptjs'


const salt = bcrypt.genSaltSync(10);

const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

await db.read()

const userData = db.data
//console.log('The database contains: ', userData)


const router = express.Router()


if (db.data === null) {
    // vi använder namnet som id i det här exemplet
    db.data = [
    ]
    await db.write()
}
router.get('/users', (req, res) => {
    res.status(200).send(db.data)

})

/* 
app.post('/login', (req, res) => {
    const { username, password } = req.body

    if (authenticateUser(username, password)) {
        const userToken = createToken(username)
        res.status(200).send(userToken)
    } else {
        res.sendStatus(401)
        return
    }

}) */

router.post('/login/', (req, res) => {

    const inputUsername = req.body.username
    const inputPassword = req.body.password

    let match = userData.find(user => user.username === inputUsername)

    let correctPassword = bcrypt.compareSync(inputPassword, match.password)

    if (!match) {
        console.log("wrong username")
        res.sendStatus(401)
        return
    }
    else if (!correctPassword) {
        console.log("wrong password")
        res.sendStatus(401)
        return
    }
    const userToken = createToken(inputUsername)
    res.status(200).send(userToken)

})



router.post('/newuser/', (req, res) => {

    const userInputData = req.body

    const pass = userInputData.password
    const ecryptedPass = encryptPassword(pass)

    //console.log(`encrypt pass is  ${ecryptedPass.password}, pass in db is ${userInputData.password}`)

    userInputData.password = ecryptedPass.password

    if (!isValidData(userInputData)) {
        res.sendStatus(400)
        return
    }

    addCookie(userInputData)

    // db.data.push({
    //     userId: newId,
    //     firstName: newUser.firstName,
    //     lastName: newUser.lastName,
    //     username: newUser.username,
    //     password: newUser.password
    // })

    res.sendStatus(200)
})

async function addCookie(userInputData) {
    const lastUserId = db.data.length

    console.log("last user id is ", lastUserId)
    const newId = lastUserId + 1

    db.data.push({
        userId: newId,
        firstName: userInputData.firstName,
        lastName: userInputData.lastName,
        username: userInputData.username,
        password: userInputData.password
    })
    db.write()
}

export default router