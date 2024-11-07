const clients = new Map();

function addClient(userId, res) {
    clients.set(userId, res);
}

function removeClient(userId) {
    clients.delete(userId);
}

function sendEvent(userId, data) {
    const client = clients.get(userId);
    if (client) {
        client.write(`data: ${JSON.stringify(data)}\n\n`);
    }
}

module.exports = { addClient, removeClient, sendEvent };
