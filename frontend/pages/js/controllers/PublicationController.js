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

    async getCategories(){
        console.log('getCategories')
        const data = await this._modelComponent.getCategories()
        if(data.status === "error"){
            alert(data.message)
        }
        return data
    }

    onClickCategorie({detail}) {
        console.log(detail)
    }
}

export { PublicationController }
