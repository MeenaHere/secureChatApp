import express from 'express'
import { isValidData, isPositiveInteger } from '../validate.js'

const router = express.Router()

const messages = [
    { id: 1, userId: 1, username: "meena m", message: "m12345", messageTime: "", meesageDate: "" },
    { id: 1, userId: 2, username: "ish m", message: "ish123", messageTime: "", meesageDate: "" },
    { id: 1, userId: 3, username: "jesh m", message: "r1234", messageTime: "", meesageDate: "" }
]

router.get('/messages', (req, res) => {
    res.status(200).send(messages)

})

router.post('/messages/', (req, res) => {
    const newMessage = req.body
    const totalUserDataIndex = messages.length - 1
    const newId = messages[totalUserDataIndex].userId + 1

    if (!isValidData(newMessage)) {
        res.sendStatus(400)
        return
    }

    messagess.push({ newMessage })
    res.sendStatus(200)
})


router.delete('/messages/:id', (req, res) => {
    const id = Number(req.params.id)

    if (!isPositiveInteger(id)) {
        res.sendStatus(400)
        return
    }

    const maybeMessageIndex = messages.findIndex(message => message.userId === id)

    if (!maybeMessage === -1) {
        res.sendStatus(404)
        return
    }
    messages.splice(maybeMessageIndex, 1)
    res.sendStatus(200)
})

export default router