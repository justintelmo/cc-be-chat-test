'use strict';

class ClientList {
    constructor() {
        this.clients = {};
        this.saveClient = this.saveClient.bind(this);
    }

    saveClient(client) {
        this.clientList[client.username] = client;
    }
}