unameInput = document.getElementById('username');
passwdInput = document.getElementById('password');


function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
    
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

function bytesToBase64(bytes) {
    return btoa(ab2str(bytes))
}


function base64ToBytes(base64) {
    return str2ab(atob(base64))
}


async function sendPasswd(type, context) {
    console.log(context)

    const hash = await crypto.subtle.digest("SHA-256", new Uint8Array([
            new TextEncoder("utf-8").encode(passwdInput.value),
            base64ToBytes(context.pubSalt)
    ]))

    const pubKey = await crypto.subtle.importKey(
        'spki',
        base64ToBytes(context.pubKey),
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        true,
        ['encrypt']
    )

    const cipher = await crypto.subtle.encrypt({name: "RSA-OAEP"}, pubKey, hash)

    fetch(`${location.href}api/user/${type}/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            uname: unameInput.value,
            passwd: bytesToBase64(cipher)
        })
    })
}


function getContext(type) {
    fetch(`${location.href}api/user/${type}/context`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uname: unameInput.value })
    })
        .then(response => response.json())
        .then(context => sendPasswd(type, context))
        .catch(error => console.log(error))
}
