/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express')
const app = express()
const path = require('path')
const https = require('https')
const fs = require('fs')
const router = express.Router()

const privateKey = fs.readFileSync('./ssl/key.pem').toString()
const certificate = fs.readFileSync('./ssl/cert.pem').toString()
const credentials = { key: privateKey, cert: certificate }
const basePath = '/gui'

app.use('/gui', router)

app.get('/', function(req, res) {
    res.redirect(basePath)
})

app.use(express.static(path.join(__dirname, 'dist')))
app.get('/*', function(req, res) {
    if (req.url.includes(basePath)) {
        res.sendFile(path.join(__dirname + '/dist/index.html'))
        return false
    }
    res.redirect(`${basePath}${req.url}`)
})

const httpsServer = https.createServer(credentials, app)
httpsServer.listen(3000)
console.log('> Ready on https://localhost:3000')
