class ModalController {
    constructor(viewComponent, modelComponent) {
        this._viewComponent = viewComponent;
        this._modelComponent = modelComponent;
    }

    async onSubmit({ title, description, exchange, state, status, ubication, tags, images }) {
        await this._modelComponent.submitPublication({
            title,
            description,
            state,
            status,
            exchange,
            ubication,
            tags,
            images,
        });
    }
}

export { ModalController };
