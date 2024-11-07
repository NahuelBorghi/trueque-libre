import { AppController } from "../controllers/AppController.js";
import { LoginView } from "./LoginView.js";
import { PublicationView } from "./PublicationView.js";
import { RegisterView } from "./RegisterView.js";
import { LoadingView } from "./LoadingView.js";

class AppView extends HTMLElement {
    constructor(modelComponent) {
        super();
        this._innerControler = new AppController(this, modelComponent);
        this._loadingView = new LoadingView(modelComponent);
        this._registerView = new RegisterView(modelComponent);
        this._loginView = new LoginView(modelComponent);
        this._publicationView = new PublicationView(modelComponent);

        this._renderComponent = this._loadingView;
        document.title = "Trueque Libre";

        this.appendChild(this._renderComponent);
    }

    resetPublications() {
        if (this._renderComponent instanceof PublicationView) {
            this._renderComponent.resetPublications();
        }
    }

    renderView(view) {
        this.removeChild(this._renderComponent);
        this._publicationView.setLogged(false);
        switch (view) {
            case "loading": {
                document.title = "falseque Libre";
                this._renderComponent = this._loadingView;
            }
            case "register":
                {
                    document.title = "Register";
                    this._renderComponent = this._registerView;
                }
                break;
            case "login":
                {
                    document.title = "Login";
                    this._renderComponent = this._loginView;
                }
                break;
            case "publications":
                {
                    document.title = "Trueque Libre";
                    this._publicationView.setLogged(true);
                    this._renderComponent = this._publicationView;
                }
                break;
            default:
                document.title = "Login";
                this._renderComponent = this._loginView;
                break;
        }
        this.appendChild(this._renderComponent);
    }

    connectedCallback() {
        this._loginView._linkRegister.onclick = () => {
            this._loginView.resetFields();
            this._innerControler.onPressRegisterTag();
        };
        this._registerView._linkLogin.onclick = () => {
            this._registerView.resetFields();
            this._innerControler.onPressLoginTag();
        };
    }

    disconnectedCallback() {}

    adoptedCallback() {}

    attributesChangedCallback(oldValue, newValue) {}

    static get observableAttributes() {}
}

customElements.define("x-app-component-view", AppView);

export { AppView };
