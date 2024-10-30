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

    nextImage() {
        this._viewComponent.plusSlides(1);
    }

    previousImage() {
        this._viewComponent.plusSlides(-1);
    }

    closeModal() {
        this._viewComponent.resetModal();
    }
}

export { PublicationDetailController };
