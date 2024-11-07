const { MongoClient } = require('mongodb');

class MongoRepository {
    constructor() {
        this.lastCheckedMessageId = null; // Para almacenar el último _id procesado en mensajes
        this.lastCheckedChatId = null; // Para almacenar el último _id procesado en chats
    }
    async setup() {
        const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
        this.dbName = process.env.MONGO_DB_NAME || "trueque-libre";
        this.client = new MongoClient(uri);
        await this.client.connect();
        this.db = this.client.db(this.dbName);
        this.messagesCollection = this.db.collection("messages");
        this.chatsCollection = this.db.collection("chats");
    }

    async disconnect() {
        await this.client.close();
    }

    async createMessage(userId, chatId, message) {
        const result = await this.messagesCollection.insertOne({
            userId,
            message,
            chatId,
            createdAt: new Date(),
            readBy: [],
        });
        return result;
    }

    async createChat(usersIds) {
        const result = await this.chatsCollection.insertOne({
            usersIds,
            createdAt: new Date(),
        });
        return result;
    }

    async findMessages(filter) {
        const result = await this.messagesCollection.find(filter).toArray();
        return result;
    }

    async findChats(userId) {
        const result = await this.chatsCollection
            .find({ usersIds: userId })
            .toArray();
        return result;
    }

    async updateMessage(filter, updateDoc) {
        const result = await this.messagesCollection.updateOne(filter, {
            $set: updateDoc,
        });
        return result;
    }

    async readMessage(userId, messageId) {
        const result = await this.messagesCollection.updateOne(
            { _id: messageId, "readBy.userId": { $ne: userId } },
            { $push: { readBy: { userId, readAt: new Date() } } }
        );
        return result;
    }

    async pollMessages(interval, callback) {
        setInterval(async () => {
            try {
                const query = this.lastCheckedMessageId ? { _id: { $gt: this.lastCheckedMessageId } } : {};
                const newMessages = await this.messagesCollection .find(query) .toArray();
                if (newMessages.length > 0) {
                    callback(newMessages);
                    this.lastCheckedMessageId = newMessages[newMessages.length - 1]._id;
                }
            } catch (err) {
                console.error("Error al hacer polling de mensajes:", err);
            }
        }, interval);
    }

    async pollChats(interval, callback) {
        setInterval(async () => {
            try {
                const query = this.lastCheckedChatId ? { _id: { $gt: this.lastCheckedChatId } } : {};
                const newChats = await this.chatsCollection .find(query).toArray();
                if (newChats.length > 0) {
                    callback(newChats);
                    this.lastCheckedChatId = newChats[newChats.length - 1]._id;
                }
            } catch (err) {
                console.error("Error al hacer polling de chats:", err);
            }
        }, interval);
    }
}

module.exports = MongoRepository;