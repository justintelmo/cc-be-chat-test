const connection = new WebSocket('ws://localhost:12345'),
    box = document.getElementById('box'),
    msg = document.getElementById('msg');

const _name = prompt("What is your name?");
connection.addEventListener('open', () => {
    connection.send(JSON.stringify({
        type: "name",
        data: _name
    }));
    console.log('connected');
});

connection.addEventListener('message', e => {
    let json = JSON.parse(e.data);
    console.log("JSON HERE");
    console.log(json);
    console.log("JSON END");
    let p = document.createElement('p');

    p.textContent = json.name + ": " + json.data.msg;
    // p.textContent = json.username + ": " + json.msg;
    box.appendChild(p);
});
 
function send (data) {
    if (connection.readyState === WebSocket.OPEN) {
        console.log(data);
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
            msg: msg.value
        }));
        msg.value = '';
    }
});

