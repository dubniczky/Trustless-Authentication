const crypto = require('crypto')
const {subtle} = crypto.webcrypto

module.exports = {
    genRSAKeys: async (keySize, publicExponent) => {
        return await subtle.generateKey({
                name: 'RSA-OAEP',
                modulusLength: keySize,
                publicExponent: publicExponent,
                hash: 'SHA-256'
            },
            true,
            ['encrypt', 'decrypt']
        )
    },

    RSAKeyToBase64: async (rsaKey) => {
        return Buffer.from(await subtle.exportKey('spki', publicKey)).toString('base64')
    },

    decryptRSA: async (privKey, data) => {
        return Buffer.from(await subtle.decrypt({name: "RSA-OAEP"}, privKey, data))
    },

    getBase64Salt: (size) => {
        return crypto.randomBytes(size).toString('base64');
    },

    hashAndSaltBase64: (data, salt) => {
        return crypto.createHash('sha256')
            .update(data)
            .update(salt)
            .digest('base64')
    },

    base64ToBuffer: (base64) => {
        return Buffer.from(base64, 'base64')
    }
}