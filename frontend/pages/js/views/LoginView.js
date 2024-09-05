import { LoginController } from '../controllers/LoginController.js'

class LoginView extends HTMLElement {
    constructor(registerModel) {
        super();
        this._innerControler = new LoginController(this, registerModel);

        this._container = document.createElement('div')
        this._container.style = 'width: 100vw; height: 100vh'
        this._container.className = 'd-flex justify-content-center align-items-center gap-4'

        this._title = document.createElement('h1')
        this._title.innerText = 'Trueque-Libre'

        const [usernameDiv, passwordDiv, checkboxDiv, registerDiv] = this.createContainers(5)

        this._usernameContainer = usernameDiv

        this._labelUsername = document.createElement('label')
        this._labelUsername.className = 'form-label'
        this._labelUsername.innerText = 'Usuario'
        this._inputUsername = document.createElement('input')
        this._inputUsername.type = 'input'
        this._inputUsername.className = 'form-control'
        this._inputUsername.id = 'username'
        this._inputUsername.setAttribute('required', true)
        this._labelUsernameError = document.createElement('label')
        this._labelUsernameError.className = 'form-label text-warning'
        this._labelUsernameError.id = 'errorLabelUser'

        this._usernameContainer.appendChild(this._labelUsername)
        this._usernameContainer.appendChild(this._inputUsername)
        this._usernameContainer.appendChild(this._labelUsernameError)

        this._passwordContainer = passwordDiv

        this._labelPassword = document.createElement('label')
        this._labelPassword.className = 'form-label'
        this._labelPassword.innerText = 'Contraseña'
        this._inputPassword = document.createElement('input')
        this._inputPassword.type = 'password'
        this._inputPassword.className = 'form-control'
        this._inputPassword.id = 'password'
        this._inputPassword.setAttribute('required', true)
        this._labelPasswordError = document.createElement('label')
        this._labelPasswordError.className = 'form-label text-warning'
        this._labelPasswordError.id = 'errorLabelPass'

        this._passwordContainer.appendChild(this._labelPassword)
        this._passwordContainer.appendChild(this._inputPassword)
        this._passwordContainer.appendChild(this._labelPasswordError)

        this._checkboxContainer = checkboxDiv
        this._checkboxContainer.className += ' form-check'
        
        this._inputCheckbox = document.createElement('input')
        this._inputCheckbox.type = 'checkbox'
        this._inputCheckbox.className = 'form-check-input'
        this._inputCheckbox.id = 'showPassword'
        this._labelCheckbox = document.createElement('label')
        this._labelCheckbox.className = 'form-check-label'
        this._labelCheckbox.innerText = 'Mostrar Contraseña'

        this._checkboxContainer.appendChild(this._inputCheckbox)
        this._checkboxContainer.appendChild(this._labelCheckbox)

        this._registerContainer = registerDiv

        this._labelRegister = document.createElement('label')
        this._labelRegister.className = 'form-label me-2'
        this._labelRegister.innerHTML = 'No tenes una cuenta registrada?'

        this._linkRegister = document.createElement('a')
        this._linkRegister.className = 'link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover'
        this._linkRegister.style = 'cursor: pointer'
        this._linkRegister.innerText = 'Registrarme'

        this._registerContainer.appendChild(this._labelRegister)
        this._registerContainer.appendChild(this._linkRegister)

        this._registerButton = document.createElement("button")
        this._registerButton.type = "submit"
        this._registerButton.classList = "btn w-100"
        this._registerButton.style = "background-color: #199b9a; color: white"
        this._registerButton.innerText = "Registrar"

        this._form = document.createElement('form')
        this._form.className = 'w-25'
        this._form.appendChild(this._usernameContainer)
        this._form.appendChild(this._passwordContainer)
        this._form.appendChild(this._checkboxContainer)
        this._form.appendChild(this._registerContainer)
        this._form.appendChild(this._registerButton)

        this._container.appendChild(this._title)
        this._container.appendChild(this._form)

        this.appendChild(this._container)
    }

    createContainers(amount) {
        return [...Array(amount).keys()].map(() => {
            const div = document.createElement('div')
            div.className = 'mb-1'
            return div
        })
    }

    showPassword(show){
        if(show){
            this._inputPassword.type = 'input'
            return
        }
        this._inputPassword.type = 'password'
    }

    getUsername(){
        return this._inputUsername.value
    }
    
    getPassword(){
        return this._inputPassword.value
    }

    updateErrorLabel(errorMessage){
        this._labelPasswordError.innerText = errorMessage
        this._labelUsernameError.innerText = errorMessage
    }

    connectedCallback(){
        this._inputCheckbox.onchange = () => {
            this._innerControler.onClickCheckbox(this._inputCheckbox.checked)
        }

        this._form.onsubmit = (ev) => {
            ev.preventDefault()
            this._innerControler.onSubmit()
        }
    }

    disconnectedCallback(){
        this._inputCheckbox.onchange = null 
        this._form.onsubmit = null  
    }

    adoptedCallback() {}

    attributesChangedCallback(oldValue, newValue) {}

    static get observableAttributes() {}
}

customElements.define('x-register-component-view', LoginView)

export { LoginView }
