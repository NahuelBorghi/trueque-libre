class PublicationController {
    constructor(viewComponent, modelComponent) {
        this._viewComponent = viewComponent;
        this._modelComponent = modelComponent;
    }

    async onPressSignOut(){
        console.log('logout')
        const data = await this._modelComponent.logout()
        if(data.status === "error"){
            alert(data.message)
        }
    }
}

export { PublicationController }
