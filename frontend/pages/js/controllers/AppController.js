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
        modelComponent.addEventListener('userLogout', () => {
            console.log('event userLogin')
            this.onUserLoggedOut()
        })
    }

    onUserLoggedOut(){
        this._viewComponent.renderView('login')
    }

    onUserLogged(){
        this._viewComponent.renderView('publications')
    }

    onPressRegisterTag(){
        this._viewComponent.renderView('register')
    }

    onPressLoginTag(){
        this._viewComponent.renderView('login')
    }
}

export { AppController }
