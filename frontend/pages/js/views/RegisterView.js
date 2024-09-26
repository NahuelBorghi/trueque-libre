import { RegisterController } from '../controllers/RegisterController.js'

class RegisterView extends HTMLElement {
    constructor(registerModel) {
        super();
        this._innerControler = new RegisterController(this, registerModel);

        this._container = document.createElement('div')
        this._container.style = 'width: 100vw; height: 100vh'
        this._container.className = 'd-flex justify-content-center align-items-center gap-4'

        this._title = document.createElement('h1')
        this._title.innerText = 'Trueque-Libre'

        const [emailDiv, usernameDiv, passwordDiv, checkboxDiv, loginDiv] = this.createContainers(5)
        this._emailContainer = emailDiv

        this._labelEmail = document.createElement('label')
        this._labelEmail.className = 'form-label'
        this._labelEmail.innerText = 'Email'
        this._inputEmail = document.createElement('input')
        this._inputEmail.type = 'email'
        this._inputEmail.className = 'form-control'
        this._inputEmail.id = 'email'
        this._inputEmail.setAttribute('required', true)
        this._labelEmailError = document.createElement('label')
        this._labelEmailError.className = 'form-label text-warning'
        this._labelEmailError.id = 'errorLabelEmail'

        this._emailContainer.appendChild(this._labelEmail)
        this._emailContainer.appendChild(this._inputEmail)
        this._emailContainer.appendChild(this._labelEmailError)

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

        this._loginContainer = loginDiv

        this._labelLogin = document.createElement('label')
        this._labelLogin.className = 'form-label me-2'
        this._labelLogin.innerHTML = 'Ya tenes cuenta registrada?'

        this._linkLogin = document.createElement('a')
        this._linkLogin.className = 'link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover'
        this._linkLogin.style = 'cursor: pointer'
        this._linkLogin.innerText = 'Loguearme'

        this._loginContainer.appendChild(this._labelLogin)
        this._loginContainer.appendChild(this._linkLogin)

        this._registerButton = document.createElement("button")
        this._registerButton.type = "submit"
        this._registerButton.classList = "btn w-100"
        this._registerButton.style = "background-color: #199b9a; color: white"
        this._registerButton.innerText = "Registrar"

        this._form = document.createElement('form')
        this._form.className = 'w-25'
        this._form.appendChild(this._emailContainer)
        this._form.appendChild(this._usernameContainer)
        this._form.appendChild(this._passwordContainer)
        this._form.appendChild(this._checkboxContainer)
        this._form.appendChild(this._loginContainer)
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
    
    getEmail(){
        return this._inputEmail.value
    }

    resetFields(){
        this._inputEmail.value = ''
        this._inputPassword.value = ''
        this._inputUsername.value = ''
        this._labelEmailError.innerText = ''
        this._labelPasswordError.innerText = ''
        this._labelUsernameError.innerText = ''
    }

    updateErrorLabel(errorMessage){
        this._labelEmailError.innerText = errorMessage
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

customElements.define('x-register-component-view', RegisterView)

export { RegisterView }
