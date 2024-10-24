import { ModalController } from "../controllers/ModalController.js";

class ModalView extends HTMLElement {
    constructor(modelComponent) {
        super();
        // Adjuntamos el shadow DOM
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                rel="stylesheet"
                integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
                crossorigin="anonymous"
            />
            <link
                href="./css/modalStyle.css"
                rel="stylesheet"
            />
        `

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

        this._form = document.createElement('form')
        this._form.className = 'd-flex flex-column gap-3 py-5'

        this._containerImage = document.createElement('div')

        this._containerImages = document.createElement('div')
        this._containerImages.className = 'd-flex flex-row gap-2 mb-3'
        
        this._inputImageLabel = document.createElement('label')
        this._inputImageLabel.innerText = 'Subir imagen'
        this._inputImageLabel.className = 'btn btn-secondary'
        this._inputImageLabel.for = 'archivo'

        this._inputImage = document.createElement('input')
        this._inputImage.type = 'file'
        this._inputImage.name = 'archivo'
        this._inputImage.accept = ".jpg, .jpeg, .png"
        this._inputImage.style.display = 'none'

        this._containerImage.appendChild(this._containerImages)
        this._containerImage.appendChild(this._inputImageLabel)
        this._containerImage.appendChild(this._inputImage)

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

        this._inputDescription = document.createElement('textarea')
        this._inputDescription.className = 'form-control'
        this._inputDescription.placeholder = 'Descripción'
        this._inputDescription.style.height = '150px'
        this._inputDescription.id = 'floatingInputDescription'

        this._containerDescription.appendChild(this._inputDescription)
        this._containerDescription.appendChild(this._inputDescriptionLabel)

        this._selectEstado = document.createElement('select')
        this._selectEstado.className = 'form-select'

        this._categoriaContainer = document.createElement('div')

        this._selectCategoria = document.createElement('select')
        this._selectCategoria.className = 'form-select'
        this._selectCategoriaOption = document.createElement('option')
        this._selectCategoriaOption.innerText = 'Elegír categoría'
        this._selectCategoriaOption.value = '0'
        this._selectCategoria.appendChild(this._selectCategoriaOption)

        this._categoriesTagContainer = document.createElement('div')
        this._categoriesTagContainer.className = 'd-flex flex-row gap-2 mt-3'

        this._categoriaContainer.appendChild(this._selectCategoria)
        this._categoriaContainer.appendChild(this._categoriesTagContainer)
        
        this.createProductStatusOption()

        this._form.appendChild(this._containerImage)
        this._form.appendChild(this._containerTitle)
        this._form.appendChild(this._containerDescription)
        this._form.appendChild(this._selectEstado)
        this._form.appendChild(this._categoriaContainer)

        this._modalFooter = document.createElement('div')
        this._modalFooter.className = 'modal-footer bg-body-tertiary'
        this._modalFooterSubmit = document.createElement('input')
        this._modalFooterSubmit.type = 'submit'
        this._modalFooterSubmit.className = 'btn btn-secondary'
        this._modalFooterSubmit.value = 'Crear trueque'

        this._modalHeader.appendChild(this._modalHeaderTitle)
        this._modalHeader.appendChild(this._modalHeaderClose)
        this._modalBody.appendChild(this._form)
        this._modalFooter.appendChild(this._modalFooterSubmit)

        this._modalContent.appendChild(this._modalHeader)
        this._modalContent.appendChild(this._modalBody)
        this._modalContent.appendChild(this._modalFooter)

        this._modalContainer.appendChild(this._modalContent)

        this.shadowRoot.appendChild(this._modalContainer)
    }

    deleteImage(target){
        this._containerImages.removeChild(target)
    }

    deleteCategorie(target){
        this._categoriesTagContainer.removeChild(target)
    }

    connectedCallback() {
        this._inputImageLabel.onclick = () => {
            this._inputImage.click()
        }

        this._selectCategoria.onchange = () => {
            const value = JSON.parse(this._selectCategoria.value)

            if(typeof value !== 'object'){
                return
            }
            
            const { id, tagName } = value
            const tag = document.createElement('div')
            const tagText = document.createElement('div')
            const button = document.createElement('button')

            tag.className = 'border border-secondary rounded p-1 d-flex flex-row gap-1'
            tagText.innerText = tagName
            button.type = 'button'
            button.className = 'btn-close'
            button.onclick = () => {
                this.deleteCategorie(tag)
            }


            tag.appendChild(tagText)
            tag.appendChild(button)
            this._categoriesTagContainer.appendChild(tag)
        }

        this._inputImage.onchange = (event) => {
            if(this._containerImages.childNodes.length === 5){
                alert("Mas de cinco imagenes no se pueden agregar")
                return
            }
            const file = event.target.files[0]
            const reader = new FileReader();

            reader.onload = (event) => {
                const source = event.target.result;
                const button = document.createElement('div')
                button.innerText = 'Borrar'
                button.className = 'btn btn-danger w-100'

                const body = document.createElement('div')
                body.className = 'card-body bg-body-secondary'

                const container = document.createElement('div')
                container.className = 'card'
                container.style.width = '200px'

                const img = document.createElement('img')
                img.className = 'card-img'
                img.style.height = '150px'
                img.src = source

                button.onclick = () => {
                    this.deleteImage(container)
                }

                body.appendChild(button)
                container.appendChild(img)
                container.appendChild(body)
                this._containerImages.appendChild(container)
            };

            reader.readAsDataURL(file);
        }
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