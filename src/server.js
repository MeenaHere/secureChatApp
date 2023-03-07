import express, { json } from 'express'
import * as url from 'url'
import * as dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import userRoutes from './routes/userroutes.js'

const app = express()
dotenv.config()

const staticPath = url.fileURLToPath(new URL('../static', import.meta.url))

app.use(express.json())
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
})

app.use(express.static(staticPath))


app.use('/api', userRoutes)

export { app }