class PublicationController {
    constructor(viewComponent, modelComponent) {
        this._viewComponent = viewComponent;
        this._modelComponent = modelComponent;
        this._isFetching = false
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

    async getPublications(tag) {
        if (tag) this._tag = tag
        else this._tag = null
        this._isFetching = true
        console.log('getPublications')
        const data = await this._modelComponent.getPublications(tag).then()
        console.log('data', data)
        if(data.status === "error"){
            alert(data.message)
        }
        this._isFetching = false
        return data
    }

    resetValues(){
        this._modelComponent.resetValues();
    }

    onClickCategorie({detail}) {
        console.log(detail)
    }
}

export { PublicationController }
