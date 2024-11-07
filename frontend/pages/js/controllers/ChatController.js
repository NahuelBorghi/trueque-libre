class ChatController {
    constructor(viewComponent, modelComponent) {
        this._viewComponent = viewComponent;
        this._modelComponent = modelComponent;
    }

    async getUser(idUser) {
        const data = await this._modelComponent.getUserById(idUser);
        return data;
    }

    async getChats(idUser) {
        const { chatsData } = await this._modelComponent.getChats(idUser).then();

        this._viewComponent.handleListChat(chatsData);
    }

    async getMessages(idChat) {
        const data = await this._modelComponent.getMessages(idChat);
        this._viewComponent.listMessages(data);
    }

    async sendMessage(idUser, idChat, message) {
        const data = await this._modelComponent.sendMessage(idUser, idChat, message);
        if (data) {
            this._viewComponent.getMessages(idChat);
        }
    }
}

export { ChatController };
