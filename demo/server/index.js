const express = require('express')
const path = require('path')

const cryptoUtils = require('./cryptoUtils')


const app = express()

// config
const PORT = 8000
const RSA_SIZE = 2048
const SALT_SIZE = 18
const PUB_EXP = new Uint8Array([1, 0, 1]);


let sessions = {}
let users = {}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static(path.join(__dirname, '..', 'client')))


app.post('/api/user/signup/context', async (req, res) => {
    if (!req.body.uname) {
        res.status(400).send('POST param uname is not defined')
        return
    }

    const uname = req.body.uname
    if (users[uname]) {
        res.status(400).send(`User ${uname} has already registered`)
        return
    }

    console.log(`Creating context for ${uname}`)

    const { publicKey, privateKey } = await cryptoUtils.genRSAKeys(RSA_SIZE, PUB_EXP)

    const pubSalt = cryptoUtils.getBase64Salt(SALT_SIZE)
    const privSalt = cryptoUtils.getBase64Salt(SALT_SIZE)

    sessions[uname] = {
        pubKey: publicKey,
        privKey: privateKey
    }

    users[uname] = {
        pubSalt: pubSalt,
        privSalt: privSalt
    }

    res.send({
        pubKey: await cryptoUtils.RSAKeyToBase64(publicKey),
        pubSalt: pubSalt
    })
})


app.post('/api/user/signup/submit', async (req, res) => {
    if (!req.body.uname || !req.body.passwd) {
        res.status(400).send('POST param uname or passwd is not defined')
        return
    }

    const uname = req.body.uname
    const passwd = req.body.passwd
    if (users[uname].hash) {
        res.status(400).send(`User ${uname} has already registered`)
        return
    }
    if (!sessions[uname]) {
        res.status(400).send(`User ${uname} has no active context`)
        return
    }

    console.log(`Registering ${uname}`)

    const decrypted = await cryptoUtils.decryptRSA(
        sessions[uname].privKey,
        cryptoUtils.base64ToBuffer(passwd)
    )

    users[uname].hash = cryptoUtils.hashAndSaltBase64(
        decrypted,
        cryptoUtils.base64ToBuffer(users[uname].privSalt)
    )

    console.log(`User ${uname} is registered with ${JSON.stringify(users[uname])}`)

    res.send('Successful registration')
})


app.listen(PORT, () => {
    console.log(`Ready on http://localhost:${PORT}`)
})
