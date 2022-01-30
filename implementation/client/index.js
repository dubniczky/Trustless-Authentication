unameInput = document.getElementById('username');
passwdInput = document.getElementById('password');


async function sendPasswd(type, context) {
    hash = await crypto.subtle.digest("SHA-256", new TextEncoder("utf-8").encode(str) + context.pubsalt)
    cipher = await crypto.subtle.encrypt({name: "RSA-OAEP"}, context.pubkey, hash)
    fetch(`/api/user/${type}/submit`, {
        method: 'POST',
        body: btoa(ab2str(cipher))
    })
}


function getContext(type) {
    fetch(`/api/user/${type}/context`, {
        method: 'POST',
        body: unameInput.value
    })
        .then(response => response.json())
        .then(context => sendPasswd(type, context))
        .catch(console.error)
}
