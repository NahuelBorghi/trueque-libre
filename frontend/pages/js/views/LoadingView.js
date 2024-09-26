import { LoadingController } from '../controllers/LoadingController.js'

class LoadingView extends HTMLElement {
    constructor(modelComponent) {
        super();
        this._innerController = new LoadingController(this, modelComponent);

        this._container = document.createElement('div')
        this._container.style = 'width: 100vw; height: 100vh'
        this._container.className = 'd-flex justify-content-center align-items-center gap-4'
         
        this._loadingText = document.createElement("h3")
        this._loadingText.innerText = 'Cargando...'

        this._container.appendChild(this._loadingText)

        this.appendChild(this._container)
    }

    connectedCallback(){
        this._innerController.init()
    }

    disconnectedCallback(){  
    }

    adoptedCallback() {}

    attributesChangedCallback(oldValue, newValue) {}

    static get observableAttributes() {}
}

customElements.define('x-loading-component-view', LoadingView)

export { LoadingView }
