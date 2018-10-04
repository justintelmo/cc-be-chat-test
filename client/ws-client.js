const connection = new WebSocket('ws://localhost:12345'),
    box = document.getElementById('box'),
    msg = document.getElementById('msg');
    username = document.getElementById('username');

var _name = prompt("What is your name?");


connection.addEventListener('open', () => {
    while (!_name) {
        _name = prompt("What is your name?");
    }
    connection.send(JSON.stringify({
        type: "name",
        data: _name
    }));
    let h1 = document.createElement('h1');
    h1.textContent = "Logged in as: " + _name;
    username.appendChild(h1);
});

connection.addEventListener('close', () => {
    username.removeChild(username.firstChild);
    let h1 = document.createElement('h1');
    h1.textContent = "DISCONNECTED FROM ROOM";
    h1.setAttribute("style", "color: red");
    username.appendChild(h1);
});

connection.addEventListener('message', e => {
    let json = JSON.parse(e.data);
    if (!json) {
        return;
    }

    let p = document.createElement('p');

    p.textContent = json.sender + ": " + json.msg;
    box.appendChild(p);
    box.scrollTop = box.scrollHeight;
});
 
function send (data) {
    if (connection.readyState === WebSocket.OPEN) {
        connection.send(data);
    } else {
        throw 'Not connected';
    }
}

msg.addEventListener('keydown', e => {
    let kc = e.which || e.keyCode;
    
    if (msg.value.length == 0) {
        // Prevent empty message spamming client-side
        return;
    }

    if (kc === 13) {
        send(JSON.stringify({
            type: "message",
            msg: msg.value,
            sender: _name
        }));
        msg.value = '';
    }
});

