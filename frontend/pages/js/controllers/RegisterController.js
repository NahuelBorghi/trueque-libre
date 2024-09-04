class RegisterController {
    constructor(viewComponent, modelComponent) {
        this._viewComponent = viewComponent;
        this._modelComponent = modelComponent;
    }

    onClickCheckbox(show){
        this._viewComponent.showPassword(show)
    }
}

export { RegisterController }
