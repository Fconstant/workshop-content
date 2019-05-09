import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import { find } from 'lodash';

const DB = require('./staff_db.json')

const server = express()
server.use(bodyParser.json())

server.use(morgan('[AUTH] :method :url :status :res[content-length] - :response-time ms'))
server.post('/auth', (req, resp) => {
    const { username, password } = req.body
    const found = find(DB, (u) => {
        return u.username === username && password === u.password
    })

    if (found) {
        resp.status(200).send()
    } else {
        resp.status(500).jsonp({
            error: 'Invalid username and/or password!'
        })
        
    }
})

server.listen(5502, () => {
    console.log(`Auth server running!`)
})