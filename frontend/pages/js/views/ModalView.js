import { ModalController } from "../controllers/ModalController.js";

class ModalView extends HTMLElement {
    constructor(modelComponent) {
        super();

        this._innerControler = new ModalController(this, modelComponent);

        this._modalContainer = document.createElement('div')
        this._modalContainer.className = 'modal'

        this._modalContent = document.createElement('div')
        this._modalContent.className = 'modal-content'

        this._modalHeader = document.createElement('div')
        this._modalHeader.className = 'modal-header justify-content-between bg-body-tertiary'
        this._modalHeaderTitle = document.createElement('h2')
        this._modalHeaderTitle.innerText = 'Crear publicación de trueque'
        this._modalHeaderClose = document.createElement('span')
        this._modalHeaderClose.className = 'btn btn-secondary'
        this._modalHeaderClose.innerText = 'Cancelar'

        this._modalBody = document.createElement('div')
        this._modalBody.className = 'modal-body'
        this._modalBodyText = document.createElement('p')
        this._modalBodyText.innerText = 'coass pa la publi...'

        this._form = document.createElement('form')
        this._form.className = 'd-flex flex-column gap-5 py-5'

        this._inputImage = document.createElement('input')
        this._inputImage.type = 'image'
        this._inputImage.className = 'form-control'

        this._containerTitle = document.createElement('div')
        this._containerTitle.className = 'form-floating'

        
        this._inputTitleLabel = document.createElement('label')
        this._inputTitleLabel.innerText = 'Título'
        this._inputTitleLabel.for = 'floatingInputTitle'
        
        this._inputTitle = document.createElement('input')
        this._inputTitle.className = 'form-control me-2'
        this._inputTitle.placeholder = 'Título'
        this._inputTitle.id = 'floatingInputTitle'
        
        this._containerTitle.appendChild(this._inputTitle)
        this._containerTitle.appendChild(this._inputTitleLabel)
        
        this._containerDescription = document.createElement('div')
        this._containerDescription.className = 'form-floating'

        this._inputDescriptionLabel = document.createElement('label')
        this._inputDescriptionLabel.innerText = 'Descripción'
        this._inputDescriptionLabel.for = 'floatingInputDescription'

        this._inputDescription = document.createElement('input')
        this._inputDescription.type = 'textarea'
        this._inputDescription.style.height = '200px'
        this._inputDescription.style.alignItems = 'flex-start'
        this._inputDescription.className = 'form-control'
        this._inputDescription.placeholder = 'Descripción'
        this._inputDescription.id = 'floatingInputDescription'

        this._containerDescription.appendChild(this._inputDescription)
        this._containerDescription.appendChild(this._inputDescriptionLabel)

        this._selectEstado = document.createElement('select')
        this._selectEstado.className = 'form-select'

        this._selectCategoria = document.createElement('select')
        this._selectCategoria.className = 'form-select'

        this.createProductStatusOption()

        this._form.appendChild(this._inputImage)
        this._form.appendChild(this._containerTitle)
        this._form.appendChild(this._containerDescription)
        this._form.appendChild(this._selectEstado)
        this._form.appendChild(this._selectCategoria)

        this._modalFooter = document.createElement('div')
        this._modalFooter.className = 'modal-footer bg-body-tertiary'
        this._modalFooterText = document.createElement('h5')
        this._modalFooterText.innerText = 'Trueque libre'

        this._modalHeader.appendChild(this._modalHeaderTitle)
        this._modalHeader.appendChild(this._modalHeaderClose)
        this._modalBody.appendChild(this._form)
        this._modalFooter.appendChild(this._modalFooterText)

        this._modalContent.appendChild(this._modalHeader)
        this._modalContent.appendChild(this._modalBody)
        this._modalContent.appendChild(this._modalFooter)

        this._modalContainer.appendChild(this._modalContent)

        this.appendChild(this._modalContainer);
    }

    connectedCallback() {
    }

    createProductStatusOption(){
        const array = [...new Array(4).keys()]

        array.forEach((i, index) => {
            const option = document.createElement('option')
            let value = 'Usado - Aceptable'
            if(index === 0){
                value = 'Nuevo'
            }
            if(index === 1){
                value = 'Usado - Como nuevo'
            }
            if(index === 2){
                value = 'Usado - Buen estado'
            }

            option.innerText = value
            option.value = value
            
            this._selectEstado.appendChild(option)
        })
    }

    disconnectedCallback() {}

    adoptedCallback() {}

    attributesChangedCallback(oldValue, newValue) {}

    static get observableAttributes() {}
}

customElements.define("x-modal-component-view", ModalView);

export { ModalView };
