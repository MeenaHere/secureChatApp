import express, { json } from 'express'
import * as url from 'url'
import * as dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { authenticateUser, createToken } from './database.js'
import userRoutes from './routes/userroutes.js'
import messagesRoutes from './routes/messageroutes.js'


const app = express()
dotenv.config()
const SECRET = process.env.SECRET
console.log('secret:', SECRET)

const staticPath = url.fileURLToPath(new URL('../static', import.meta.url))

app.use(express.json())
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
})

app.use(express.static(staticPath))


app.use('/api', userRoutes, messagesRoutes)


app.post('/login', (req, res) => {
    const { username, password } = req.body

    if (authenticateUser(username, password)) {
        const userToken = createToken(username)
        res.status(200).send(userToken)
    } else {
        res.sendStatus(401)
        return
    }

})


app.get('/secret', (req, res) => {
    let token = req.body.token || req.query.token

    if (!token) {
        let str = req.headers['authorizationcreateToken']
        if (str === undefined) {
            res.sendStatus(401)
            return
        }
        token = str.substring(7)
    }

    if (token) {
        let decoded
        try {
            decoded = jwt.verify(token, process.env.SECRET)
        } catch (err) {
            console.log('Catch! Wrong token')
            res.sendStatus(401)
            return
        }

        console.log('Decoded: ', decoded)
        res.send('You have access')
    } else {
        res.sendStatus(401)
    }
})

export { app }