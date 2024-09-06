class AppController {
    constructor(viewComponent, modelComponent) {
        this._viewComponent = viewComponent;
        this._modelComponent = modelComponent;

        modelComponent.addEventListener('userRegister', () => {
            console.log('event userRegister')
            this.onUserLogged()
        })
        modelComponent.addEventListener('userLogin', () => {
            console.log('event userLogin')
            this.onUserLogged()
        })
    }

    onUserLogged(){
        this._viewComponent.renderView('home')
    }

    onPressRegisterTag(){
        this._viewComponent.renderView('register')
    }

    onPressLoginTag(){
        this._viewComponent.renderView('login')
    }
}

export { AppController }
