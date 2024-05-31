import express from 'express';
import { isValidData, isValidMessage } from '../validate.js';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { encryptPassword, createToken } from '../auth.js';
import bcrypt from 'bcryptjs';

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

await db.read();

if (!db.data) {
    db.data = { users: [], messages: [], channels: [] };
    await db.write();
}

const router = express.Router();
const { users, messages } = db.data;

router.get('/users/:id', (req, res) => {
    const user = users.find(user => user.userId === Number(req.params.id));
    user ? res.status(200).send(user) : res.sendStatus(404);
});

router.post('/login/', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.sendStatus(401);
    }

    const token = createToken(username);
    res.status(200).send(token);
});

router.post('/loginwithsecrete', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Invalid token' });

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });

        const user = users.find(u => u.username === decoded.username);
        if (!user) return res.sendStatus(404);

        res.status(200).send({ username: user.username, token });
    });
});

router.post('/newuser/', async (req, res) => {
    const { password, ...userData } = req.body;
    const encryptedPassword = encryptPassword(password).password;

    if (!isValidData({ ...userData, password: encryptedPassword })) {
        return res.sendStatus(400);
    }

    await addUser({ ...userData, password: encryptedPassword });
    const token = createToken(userData.username);
    res.status(200).send(token);
});

async function addUser(userInputData) {
    const newId = users.length + 1;
    users.push({ userId: newId, ...userInputData });
    await db.write();
}

router.get('/messages/:channelName', (req, res) => {
    const messagesInChannel = messages.filter(msg => msg.channelName === req.params.channelName);
    messagesInChannel.length ? res.status(200).send(messagesInChannel) : res.sendStatus(404);
});

router.post('/message/', async (req, res) => {
    const messageInfo = req.body;

    if (!isValidMessage(messageInfo)) {
        return res.sendStatus(400);
    }

    await addMessage(messageInfo);
    res.sendStatus(200);
});

async function addMessage(messageData) {
    const newId = messages.length + 1;
    messages.push({ msgId: newId, ...messageData });
    await db.write();
}

export default router;
