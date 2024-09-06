import { PublicationController } from '../controllers/PublicationController.js'

class PublicationView extends HTMLElement {
    constructor(modelComponent) {
        super();
        this._innerControler = new PublicationController(this, modelComponent);

        this._container = document.createElement('div')
        this._container.style = 'width: 100vw; height: 100vh'
        this._container.className = 'd-flex justify-content-center align-items-center gap-4'

        this._title = document.createElement('h1')
        this._title.innerText = 'Trueque-Libre'

        this._logout = document.createElement('button')
        this._logout.classList = "btn w-25"
        this._logout.style = "background-color: #199b9a; color: white"
        this._logout.innerText = "Desloguear"

        this._container.appendChild(this._title)
        this._container.appendChild(this._logout)

        this.appendChild(this._container)
    }

    connectedCallback(){
        this._logout.onclick = () => {
            this._innerControler.onPressSignOut()
        }
    }

    disconnectedCallback(){}

    adoptedCallback() {}

    attributesChangedCallback(oldValue, newValue) {}

    static get observableAttributes() {}
}

customElements.define('x-publication-component-view', PublicationView)

export { PublicationView }
