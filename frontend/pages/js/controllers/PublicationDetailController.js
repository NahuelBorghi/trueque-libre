class PublicationDetailController {
    constructor(viewComponent, modelComponent) {
        this._viewComponent = viewComponent;
        this._modelComponent = modelComponent;
    }

    async getImage(idImage) {
        if (!idImage) return;
        const data = await this._modelComponent.getImages(idImage);

        if (!data.ok) {
            console.error("ERROR EN TRAER IMAGEN");
            return;
        }
        return await data.blob();
    }

    async getUser(idUser) {
        const data = await this._modelComponent.getUserById(idUser);
        return data;
    }

    nextImage() {
        this._viewComponent.plusSlides(1);
    }

    previousImage() {
        this._viewComponent.plusSlides(-1);
    }

    closeModal() {
        this._viewComponent.resetModal();
    }

    async createChat(idUserSender, idUserReceptor, message) {
        const dataChat = await this._modelComponent.createChat(idUserSender, idUserReceptor);
        if (dataChat) {
            const {
                chatData: { insertedId },
            } = dataChat;
            await this._modelComponent.sendMessage(idUserSender, insertedId, message);
            return true;
        }
    }
}

export { PublicationDetailController };
