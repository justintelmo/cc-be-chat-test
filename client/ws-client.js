const connection = new WebSocket('ws://localhost:12345'),
    box = document.getElementById('box'),
    msg = document.getElementById('msg');

var _name = prompt("What is your name?");


connection.addEventListener('open', () => {
    while (!_name) {
        _name = prompt("What is your name?");
    }   
    console.log(_name);
    connection.send(JSON.stringify({
        type: "name",
        data: _name
    }));
    console.log('connected');
});

connection.addEventListener('message', e => {
    let json = JSON.parse(e.data);
    if (!json) {
        return;
    }
    console.log(json);
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
    
    if (kc === 13) {
        send(JSON.stringify({
            type: "message",
            msg: msg.value,
            sender: _name
        }));
        msg.value = '';
    }
});

