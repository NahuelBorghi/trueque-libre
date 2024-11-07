const BaseException = require("../exceptions/BaseException");
const ChatService = require("../service/ChatService");
const { addClient, removeClient, sendEvent } = require("../utils/sseManager");

class ChatController {
    constructor() {
        this.setup();
    }

    async setup() {
        const label = `-------------------- ChatController setup - ${Date.now()}`;
        console.time(label);

        // Inicializa el servicio de chat
        this.chatService = new ChatService();
        await this.chatService.setup();

        // Configura el polling para los mensajes
        this.chatService.pollMessages((newMessages) => {
            if (!newMessages) return;
            newMessages.forEach((message) => {
                const { chatId } = message;
                const chatUsers = chatId.split("-");
                chatUsers.forEach((userId) => {
                    sendEvent(userId, message);
                });
            });
        });

        // Configura el polling para los chats
        this.chatService.pollChats((newChats) => {
            newChats.forEach((chat) => {
                const { _id: chatId, usersIds } = chat;
                usersIds.forEach((userId) => {
                    sendEvent(userId, { chatId, type: "chat" });
                });
            });
        });

        console.timeLog(label, "ChatService setup complete");
        console.timeEnd(label);
    }

    async getEvents(req, res) {
        const label = `-------------------- Get events - ${Date.now()}`;
        console.time(label);
        try {
            const { userId } = req.params;
            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");
            res.flushHeaders();

            addClient(userId, res);

            req.on("close", () => {
                removeClient(userId);
            });
            req.on("end", () => {
                removeClient(userId);
            });
            res.on("error", (err) => {
                console.error(
                    `Error in SSE connection for ${userId}:`,
                    err.message
                );
                removeClient(userId); // Quita al cliente de la lista activa
            });
        } catch (error) {
            console.timeEnd(label);
            throw new BaseException(
                `ChatController.getEvents: ${error.message}`,
                error.statusCode ?? 400,
                "Bad Request",
                "GetEventsError"
            );
        }
    }

    async sendMessage(req, res) {
        const label = `-------------------- Send message - ${Date.now()}`;
        console.time(label);
        try {
            const { userId, chatId, message } = req.body;
            const messageData = await this.chatService.sendMessage(
                userId,
                chatId,
                message
            );
            console.timeLog(label, "message sent successfully");
            console.timeEnd(label);
            return res
                .status(201)
                .send({ message: "Message sent", messageData });
        } catch (error) {
            console.timeEnd(label);
            throw new BaseException(
                `ChatController.sendMessage: ${error.message}`,
                error.statusCode ?? 400,
                "Bad Request",
                "SendMessageError"
            );
        }
    }

    async readMessage(req, res) {
        const label = `-------------------- Read message - ${Date.now()}`;
        console.time(label);
        try {
            const { userId, messageId } = req.body;
            await this.chatService.readMessage(userId, messageId);
            console.timeLog(label, "message read successfully");
            console.timeEnd(label);
            return res.status(200).send({ message: "Message read" });
        } catch (error) {
            console.timeEnd(label);
            throw new BaseException(
                `ChatController.readMessage: ${error.message}`,
                error.statusCode ?? 400,
                "Bad Request",
                "ReadMessageError"
            );
        }
    }

    async createChat(req, res) {
        const label = `-------------------- Create chat - ${Date.now()}`;
        console.time(label);
        try {
            const { usersIds } = req.body;
            const chatData = await this.chatService.createChat(usersIds);
            console.timeLog(label, "chat created successfully");
            console.timeEnd(label);
            return res.status(201).send({ message: "Chat created", chatData });
        } catch (error) {
            console.timeEnd(label);
            throw new BaseException(
                `ChatController.createChat: ${error.message}`,
                error.statusCode ?? 400,
                "Bad Request",
                "CreateChatError"
            );
        }
    }

    async findChats(req, res) {
        const label = `-------------------- Find chats - ${Date.now()}`;
        console.time(label);
        try {
            const { userId } = req.params;
            const chatsData = await this.chatService.findChats(userId);
            console.timeLog(label, "chats found successfully");
            console.timeEnd(label);
            return res.status(200).send({ message: "Chats found", chatsData });
        } catch (error) {
            console.timeEnd(label);
            throw new BaseException(
                `ChatController.findChats: ${error.message}`,
                error.statusCode ?? 400,
                "Bad Request",
                "FindChatsError"
            );
        }
    }

    async getMessages(req, res) {
        const label = `-------------------- Get messages - ${Date.now()}`;
        console.time(label);
        try {
            const { chatId } = req.params;
            const messagesData = await this.chatService.findMessages({ chatId });
            console.timeLog(label, "messages found successfully");
            console.timeEnd(label);
            return res.status(200).send({ message: "Messages found", messagesData });
        } catch (error) {
            console.timeEnd(label);
            throw new BaseException(
                `ChatController.getMessages: ${error.message}`,
                error.statusCode ?? 400,
                "Bad Request",
                "GetMessagesError"
            );
        }
    }

    async sendEvent(req, res) {
        const label = `-------------------- Send event - ${Date.now()}`;
        console.time(label);
        try {
            const { userId, data } = req.body;
            sendEvent(userId, data);
            console.timeLog(label, "event sent successfully");
            console.timeEnd(label);
            return res.status(200).send({ message: "Event sent" });
        } catch (error) {
            console.timeEnd(label);
            throw new BaseException(
                `ChatController.sendEvent: ${error.message}`,
                error.statusCode ?? 400,
                "Bad Request",
                "SendEventError"
            );
        }
    }
}

module.exports = ChatController;