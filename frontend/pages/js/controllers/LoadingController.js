class LoadingController {
    constructor(viewComponent, modelComponent) {
        this._viewComponent = viewComponent;
        this._modelComponent = modelComponent;
    }

    init(){
        this._modelComponent.verify() 
    }
}

export { LoadingController }
