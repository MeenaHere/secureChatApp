import express from 'express'
import { isValidData, isPositiveInteger } from '../validate.js'

const router = express.Router()

//console.log('The database contains: ', userData)


router.get('/messages', (req, res) => {
    res.status(200).send(db.data)

})

router.post('/messages/', (req, res) => {

    //check if user is logged in
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



router.post('/message/', (req, res) => {

    const inputData = req.body

    addCookie(inputData)

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

async function addCookie(messageData) {
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