import express from 'express'
import { isValidData } from '../validate.js'

const router = express.Router()

const userData = [
    { userId: 1, firstName: "Meena", lastName: "M", username: "meena m", password: "m12345" },
    { userId: 2, firstName: "Ish", lastName: "D", username: "meena m", password: "ish123" },
    { userId: 3, firstName: "Raj", lastName: "D", username: "meena m", password: "r1234" }
]

router.get('/users', (req, res) => {
    res.status(200).send(userData)

})

router.post('/users/', (req, res) => {
    const newUser = req.body
    const totalUserDataIndex = userData.length - 1
    const newId = userData[totalUserDataIndex].userId + 1

    if (!isValidData(newUser)) {
        res.sendStatus(400)
        return
    }

    userData.push({
        userId: newId,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        password: newUser.password
    })
    res.sendStatus(200)
})

export default router