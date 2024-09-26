class RegisterController {
    constructor(viewComponent, modelComponent) {
        this._viewComponent = viewComponent;
        this._modelComponent = modelComponent;
    }

    onClickCheckbox(show){
        this._viewComponent.showPassword(show)
    }

    async onSubmit(){
        const userName = this._viewComponent.getUsername()
        const password = this._viewComponent.getPassword()
        const email = this._viewComponent.getEmail()

        if(!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)){
            this._viewComponent.updateErrorLabel('El email no es válido')
            return 
        }
        if(!password.match(/^(?=.*\d).{4,8}$/)){
            this._viewComponent.updateErrorLabel('La contraseña tiene que ser de 4 u 8 dígitos de largo y contener al menos un número')
            return 
        }

        const data = await this._modelComponent.register({ userName, password, email })

        if(data.status === "error"){
            this._viewComponent.updateErrorLabel(data.message)
            return
        }
        this._viewComponent.resetFields()
    }
}

export { RegisterController }
