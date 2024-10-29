class AppController {
    constructor(viewComponent, modelComponent) {
        this._viewComponent = viewComponent;
        this._modelComponent = modelComponent;

        modelComponent.addEventListener('userRegister', () => {
            console.log('event userRegister')
            this.onUserRegistered()
        })
        modelComponent.addEventListener('userLogin', () => {
            console.log('event userLogin')
            this.onUserLogged()
        })
        modelComponent.addEventListener('userLogout', () => {
            console.log('event userLogout')
            this.onUserLoggedOut()
        })
        modelComponent.addEventListener('tokenVerify', (e) => {
            console.log('event tokenVerify', e.detail)
            
            if(e.detail.status === 200){
                this.onUserLogged()
                return
            }

            this.onUserLoggedOut()
        })
        modelComponent.addEventListener('submitPublication', (e) => {
            this._viewComponent.resetPublications()
        })
    }

    onUserLoggedOut(){
        this._viewComponent.renderView('login')
    }

    onUserRegistered(){
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
