"use strict";

const WebSocket = require('ws'),
    server = new WebSocket.Server({
        port: 12345,
    });

function broadcast (data) {
    server.clients.forEach(ws => {
        ws.send(JSON.stringify({
            name: ws.userName,
            data: data
        }));
    });
}

server.on('connection', ws => {
    ws.on('message', data => {
        data = JSON.parse(data);
        if (data.type == "name") {
            ws.userName = data.data;
            return;
        }
        broadcast(data);
    });
});