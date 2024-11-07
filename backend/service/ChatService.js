const BaseException = require("../exceptions/BaseException");
const MongoRepository = require("../repository/MongoRepository");

class ChatService {
    constructor() {
    }

    async setup() {
        console.time('ChatService setup');
        this.mongoRepository = new MongoRepository();
        await this.mongoRepository.setup();
        console.timeLog('ChatService setup', 'MongoRepository setup complete');
        console.timeEnd('ChatService setup');
    }

    async sendMessage(userId, chatId, message) {
        try {
            return await this.mongoRepository.createMessage(userId, chatId, message);
        } catch (error) {
            throw new BaseException(`sendMessageService: ${error.message}`, error.statusCode??400, "Bad Request", "SendMessageError");
        }
    }

    async readMessage(userId, messageId) {
        try {
            return await this.mongoRepository.readMessage(userId, messageId);
        } catch (error) {
            throw new BaseException(`readMessageService: ${error.message}`, error.statusCode??400, "Bad Request", "ReadMessageError");
        }
    }

    async pollMessages(callback) {
        try {
            const interval = 5000;
            this.mongoRepository.pollMessages(interval, callback);
        } catch (error) {
            throw new BaseException( `pollMessagesService: ${error.message}`, error.statusCode ?? 400, "Bad Request", "PollMessagesError" );
        }
    }

    async pollChats(callback) {
        try {
            const interval = 5000;
            this.mongoRepository.pollChats(interval, callback);
        } catch (error) {
            throw new BaseException( `pollChatsService: ${error.message}`, error.statusCode ?? 400, "Bad Request", "PollChatsError" );
        }
    }

    async createChat(usersIds) {
        try {
            return await this.mongoRepository.createChat(usersIds);
        } catch (error) {
            throw new BaseException(`createChatService: ${error.message}`, error.statusCode??400, "Bad Request", "CreateChatError");
        }
    }

    async findChats(userId) {
        try {
            return await this.mongoRepository.findChats(userId);
        } catch (error) {
            throw new BaseException(`findChatsService: ${error.message}`, error.statusCode??400, "Bad Request", "FindChatsError");
        }
    }

    async findMessages(chatId) {
        try {
            return await this.mongoRepository.findMessages({ chatId });
        } catch (error) {
            throw new BaseException(`getMessagesService: ${error.message}`, error.statusCode??400, "Bad Request", "GetMessagesError");
        }
    }

    async getChatUsers(chatId) {
        try {
            return await this.mongoRepository.getChatUsers(chatId);
        } catch (error) {
            throw new BaseException(`getChatUsersService: ${error.message}`, error.statusCode??400, "Bad Request", "GetChatUsersError");
        }
    }

}

module.exports = ChatService;