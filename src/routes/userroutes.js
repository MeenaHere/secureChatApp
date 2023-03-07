import express from 'express'
import { isValidData, isValidMessage } from '../validate.js'
import * as dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { encryptPassword, createToken } from '../auth.js'
import bcrypt from 'bcryptjs'

const salt = bcrypt.genSaltSync(10);
dotenv.config()
const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

await db.read()

const router = express.Router()

if (db.data === null) {
    // vi använder namnet som id i det här exemplet
    db.data ||= {
        users:
            [
            ],
        messages: [],
        channels: []
    }
    await db.write()
}

let msgData = db.data.messages
const userData = db.data.users

router.get('/users/:id', (req, res) => {

    const id = Number(req.params.id)

    let maybeUser = userData.find(user => user.userId === id)
    if (maybeUser) {
        res.status(200).send(maybeUser)
    } else {
        res.sendStatus(404)
    }
})


router.post('/login/', (req, res) => {

    const inputUsername = req.body.username
    const inputPassword = req.body.password
    let match = matchUser(inputUsername)

    let correctPassword = bcrypt.compareSync(inputPassword, match.password)

    if (match === undefined) {
        res.sendStatus(404)
        return
    }
    else if (!correctPassword) {
        res.sendStatus(401)
        return
    }
    const userToken = createToken(inputUsername)
    res.status(200).send(userToken)

})
router.post('/loginwithsecrete', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        decoded = jwt.verify(token, process.env.SECRET)
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const foundUser = matchUser(decoded.username)

        const userInfo = { username: foundUser.username, token: token }
        res.status(200).send(userInfo)
    });
});


router.post('/newuser/', (req, res) => {

    const userInputData = req.body

    const pass = userInputData.password
    const ecryptedPass = encryptPassword(pass)

    userInputData.password = ecryptedPass.password

    if (!isValidData(userInputData)) {
        res.sendStatus(400)
        return
    }

    addUser(userInputData)
    const userToken = createToken(userInputData.username)
    res.status(200).send(userToken)
})

async function addUser(userInputData) {
    const lastUserId = db.data.users.length

    const newId = lastUserId + 1

    db.data.users.push({
        userId: newId,
        firstName: userInputData.firstName,
        lastName: userInputData.lastName,
        username: userInputData.username,
        password: userInputData.password
    })
    db.write()
}

function matchUser(username) {
    let match = userData.find(user => user.username === username)
    return match
}

// Messages routes
//getAll messages with channel name
router.get('/messages/:channelName', (req, res) => {
    const channelName = req.params.channelName

    let matchedChannelMessages = matchChannel(channelName)

    if (matchedChannelMessages === undefined) {
        res.sendStatus(404)
    }

    res.status(200).send(matchedChannelMessages)
})

router.post('/message/', (req, res) => {
    const messageInfo = req.body

    if (!isValidMessage(messageInfo)) {
        res.sendStatus(400)
        retrun
    }

    addMessage(req.body)
    res.sendStatus(200)

})

async function addMessage(messageData) {

    const lastmessageId = db.data.messages.length

    console.log("last message id is ", lastmessageId)
    const newId = lastmessageId + 1

    let matchedUser = matchUser(messageData.username)

    db.data.messages.push({
        msgId: newId,
        username: messageData.username,
        message: messageData.message,
        channelName: messageData.channelName,
        date: messageData.date,
        time: messageData.time
    })

    db.write()
}

function matchChannel(inputChannelName) {
    let match = db.data.messages.filter(channelMsg => channelMsg.channelName === inputChannelName)
    return match
}

export default router