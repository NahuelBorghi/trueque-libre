class PublicationController {
    constructor(viewComponent, modelComponent) {
        this._viewComponent = viewComponent;
        this._modelComponent = modelComponent;
        this._isFetching = false;
    }

    async onPressSignOut() {
        const data = await this._modelComponent.logout();
        if (data.status === "error") {
            alert(data.message);
        }
    }

    async getCategories() {
        const data = await this._modelComponent.getCategories();
        if (data.status === "error") {
            alert(data.message);
        }
        return data;
    }

    async getPublications(tag) {
        if (tag) {
            this._tag = tag;
        } else {
            this._tag = null;
        }
        this._isFetching = true;
        const data = await this._modelComponent.getPublications(tag).then();
        if (data.status === "error") {
            alert(data.message);
        }
        this._isFetching = false;
        return data;
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

    resetValues() {
        this._modelComponent.resetValues();
    }

    onClickCategorie({ detail }) {
        this._viewComponent.handleOnClickTag(detail.target);
    }

    onClickVisualize({ detail }) {
        this._viewComponent.openPublicationDetail(detail);
    }

    fetchNewPublications() {
        this._viewComponent.resetPublications();
    }

    onPressExplorar() {
        this._viewComponent.addPublications();
    }

    onEventMessage(data) {
        this._viewComponent.handleEventMessage(data);
    }

    onEventError(error) {
        this._viewComponent.handleEventError(error);
    }
}

export { PublicationController };
