class ModalController {
    constructor(viewComponent, modelComponent) {
        this._viewComponent = viewComponent;
        this._modelComponent = modelComponent;
    }

    async onSubmit({ title, description, exchange, state, status, ubication, tags, images }) {
        const { id: idPublication } = await this._modelComponent.submitPublication({
            title,
            description,
            state,
            status,
            exchange,
            ubication,
            tags
        }).then();
        this._modelComponent.submitImage({ idPublication, images });
        console.log('idPublication', idPublication)
        // this._viewComponent.closeModal();
    }
}

export { ModalController };
