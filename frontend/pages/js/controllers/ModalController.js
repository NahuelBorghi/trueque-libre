class ModalController {
    constructor(viewComponent, modelComponent) {
        this._viewComponent = viewComponent;
        this._modelComponent = modelComponent;
    }

    onSubmit({ title, description, exchange, state, status, ubication, tags, images }) {
        const { idPublication } = this._modelComponent.submitPublication({
            title,
            description,
            state,
            status,
            exchange,
            ubication,
            tags
        });
        this._modelComponent.submitImage({ idPublication, images });
        console.log('idPublication', idPublication)
        // this._viewComponent.closeModal();
    }
}

export { ModalController };
