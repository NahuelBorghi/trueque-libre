import { AppController } from '../controllers/AppController.js'
import { LoginView } from './LoginView.js';
import { PublicationView } from './PublicationView.js';
import { RegisterView } from './RegisterView.js';

class AppView extends HTMLElement {
    constructor(modelComponent) {
        super();
        this._innerControler = new AppController(this, modelComponent);
        this._registerView = new RegisterView(modelComponent)
        this._loginView = new LoginView(modelComponent)
        this._publicationView = new PublicationView(modelComponent)

        this._renderComponent = this._loginView
        document.title = 'Login'

        this.appendChild(this._renderComponent)
    }

    renderView(view){
        this.removeChild(this._renderComponent)
        switch (view) {
            case 'register':
            {
                document.title = 'Register'
                this._renderComponent = this._registerView
            }
                break;
            case 'login':
            {
                document.title = 'Login'
                this._renderComponent = this._loginView
            }
                break;
            case 'publications':
            {
                document.title = 'Trueque Libre'
                this._renderComponent = this._publicationView
            }
                break;
            default:
                document.title = 'Login'
                this._renderComponent = this._loginView
                break;
        }
        this.appendChild(this._renderComponent)
    }

    connectedCallback(){
        this._loginView._linkRegister.onclick = () => {
            this._innerControler.onPressRegisterTag()
        }
        this._registerView._linkLogin.onclick = () => {
            this._innerControler.onPressLoginTag()
        }
    }

    disconnectedCallback(){}

    adoptedCallback() {}

    attributesChangedCallback(oldValue, newValue) {}

    static get observableAttributes() {}
}

customElements.define('x-app-component-view', AppView)

export { AppView }
