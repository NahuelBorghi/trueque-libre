import { PublicationDetailController } from "../controllers/PublicationDetailController.js";

class PublicationDetailView extends HTMLElement {
    constructor(modelComponent) {
        super();
        this._innerControler = new PublicationDetailController(this, modelComponent);

        this._modalContainer = document.createElement("div");
        this._modalContainer.className = "modal py-4";

        this._modalContent = document.createElement("div");
        this._modalContent.className = "modal-content";
        this._modalContent.style.width = "50%";
        this._modalContent.style.height = "100%";

        this._modalHeader = document.createElement("div");
        this._modalHeader.className = "modal-header justify-content-between bg-body-tertiary";
        this._modalHeaderTitle = document.createElement("h2");
        this._modalHeaderTitle.innerText = "Detalle";
        this._modalHeaderClose = document.createElement("span");
        this._modalHeaderClose.className = "btn btn-secondary";
        this._modalHeaderClose.innerText = "Cancelar";

        this._modalBody = document.createElement("div");
        this._modalBody.className = "modal-body";
        this._modalBody.style.overflow = "auto";

        this._title = document.createElement("h3");
        this._title.innerText = "Titulo";

        this._description = document.createElement("h3");
        this._description.innerText = "Descripción";

        this._exchange = document.createElement("h3");
        this._exchange.innerText = "Cambio por";

        this._state = document.createElement("h3");
        this._state.innerText = "Estado";

        this._tags = document.createElement("h3");
        this._tags.innerText = "Categorías";

        this._modalFooter = document.createElement("div");
        this._modalFooter.className = "modal-footer bg-body-tertiary";
        this._modalFooterText = document.createElement("h5");
        this._modalFooterText.innerText = "Trueque libre";

        this._modalHeader.appendChild(this._modalHeaderTitle);
        this._modalHeader.appendChild(this._modalHeaderClose);
        this._modalBody.appendChild(this._title);
        this._modalBody.appendChild(this._description);
        this._modalBody.appendChild(this._exchange);
        this._modalBody.appendChild(this._state);
        this._modalBody.appendChild(this._tags);
        this._modalFooter.appendChild(this._modalFooterText);

        this._modalContent.appendChild(this._modalHeader);
        this._modalContent.appendChild(this._modalBody);
        this._modalContent.appendChild(this._modalFooter);

        this._modalContainer.appendChild(this._modalContent);

        this.appendChild(this._modalContainer);
    }

    setPublicationData({
        id,
        title,
        description,
        state,
        ubication,
        exchange,
        creationDate,
        creationUser,
        tags,
        images,
    }) {
        console.log("PublicationDetailView setPublicationData", {
            id,
            title,
            description,
            state,
            ubication,
            exchange,
            creationDate,
            creationUser,
            tags,
            images,
        });
    }

    connectedCallback() {}

    disconnectedCallback() {}

    adoptedCallback() {}

    attributesChangedCallback(oldValue, newValue) {}

    static get observableAttributes() {}
}

customElements.define("x-detail-component-view", PublicationDetailView);

export { PublicationDetailView };
