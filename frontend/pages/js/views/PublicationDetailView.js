import { PublicationDetailController } from "../controllers/PublicationDetailController.js";

class PublicationDetailView extends HTMLElement {
    constructor(modelComponent) {
        super();
        this.imageIndex = 1;
        this._innerControler = new PublicationDetailController(this, modelComponent);

        this._modalContainer = document.createElement("div");
        this._modalContainer.className = "modal";
        this._modalContainer.style.padding = "0px";

        this._modalContent = document.createElement("div");
        this._modalContent.className = "modal-content";
        this._modalContent.style.width = "100%";
        this._modalContent.style.height = "100%";
        this._modalContent.style.borderRadius = "0px";

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
        this._modalBody.style.padding = "0px";

        this._container = document.createElement("div");
        this._container.className = "w-100 h-100 d-flex flex-row";

        this._imagesContainer = document.createElement("div");
        this._imagesContainer.className =
            "w-75 h-100 bg-body-secondary d-flex align-items-center justify-content-center";

        this._buttonLeft = document.createElement("button");
        this._buttonLeft.className =
            "btn btn-light rounded-circle position-absolute top-50 start-0 translate-middle-y border";
        this._buttonLeft.style = "height: 50px; width: 50px";
        this._buttonLeft.id = "ignore";
        this._buttonLeft.innerHTML = "&#10094;";

        this._buttonRight = document.createElement("button");
        this._buttonRight.className = "btn btn-light rounded-circle position-absolute top-50 translate-middle-y border";
        this._buttonRight.style = "height: 50px; width: 50px; right: 25%";
        this._buttonRight.id = "ignore";
        this._buttonRight.innerHTML = "&#10095;";

        this._text = document.createElement("div");
        this._text.id = "ignore";
        this._text.className = "position-absolute top-0 start-0";

        this._imagesContainer.appendChild(this._text);
        this._imagesContainer.appendChild(this._buttonLeft);
        this._imagesContainer.appendChild(this._buttonRight);

        this._dataContainer = document.createElement("div");
        this._dataContainer.className = "w-25 h-100 p-3 d-flex flex-column gap-2";

        this._titleContainer = document.createElement("div");
        this._title = document.createElement("h2");
        this._title.innerText = "Titulo";

        this._titleContainer.appendChild(this._title);

        this._descriptionContainer = document.createElement("div");
        this._description = document.createElement("h5");
        this._description.innerText = "Descripción del permutador";

        this._descriptionContainer.appendChild(this._description);

        this._exchangeContainer = document.createElement("div");
        this._exchange = document.createElement("h5");
        this._exchange.innerText = "Cambio por";

        this._exchangeContainer.appendChild(this._exchange);

        this._stateContainer = document.createElement("div");
        this._state = document.createElement("h5");
        this._state.innerText = "Estado";

        this._stateContainer.appendChild(this._state);

        this._usuarioContainer = document.createElement("div");
        this._usuario = document.createElement("h5");
        this._usuario.innerText = "Usuario";

        this._usuarioContainer.appendChild(this._usuario);

        this._dateContainer = document.createElement("div");

        this._tagsContainer = document.createElement("div");
        this._tags = document.createElement("h5");
        this._tags.innerText = "Categorías";
        this._tagsContent = document.createElement("div");
        this._tagsContent.className = "d-flex flex-wrap gap-2";

        this._tagsContainer.appendChild(this._tags);
        this._tagsContainer.appendChild(this._tagsContent);

        this._dataContainer.appendChild(this._titleContainer);
        this._dataContainer.appendChild(this._dateContainer);
        this._dataContainer.appendChild(this._descriptionContainer);
        this._dataContainer.appendChild(this._exchangeContainer);
        this._dataContainer.appendChild(this._stateContainer);
        this._dataContainer.appendChild(this._tagsContainer);
        this._dataContainer.appendChild(this._usuarioContainer);

        this._container.appendChild(this._imagesContainer);
        this._container.appendChild(this._dataContainer);

        this._modalFooter = document.createElement("div");
        this._modalFooter.className = "modal-footer bg-body-tertiary";
        this._modalFooterText = document.createElement("h5");
        this._modalFooterText.innerText = "Trueque libre";

        this._modalHeader.appendChild(this._modalHeaderTitle);
        this._modalHeader.appendChild(this._modalHeaderClose);
        this._modalBody.appendChild(this._container);
        this._modalFooter.appendChild(this._modalFooterText);

        this._modalContent.appendChild(this._modalHeader);
        this._modalContent.appendChild(this._modalBody);
        this._modalContent.appendChild(this._modalFooter);

        this._modalContainer.appendChild(this._modalContent);

        this.appendChild(this._modalContainer);
    }

    setPublicationData(publicationData) {
        console.log("PublicationDetailView setPublicationData", publicationData);

        const {
            id,
            title,
            description,
            state,
            ubication,
            exchange,
            creationDate,
            creationUser,
            publicationTags,
            images,
        } = publicationData;

        this._title.innerText = title;
        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = description;
        this._descriptionContainer.appendChild(descriptionElement);

        const stateElement = document.createElement("p");
        stateElement.innerText = state;
        this._stateContainer.appendChild(stateElement);

        const exchangeElement = document.createElement("p");
        exchangeElement.innerText = exchange;
        this._exchangeContainer.appendChild(exchangeElement);

        const creationUserElement = document.createElement("p");
        creationUserElement.innerText = creationUser;
        this._usuarioContainer.appendChild(creationUserElement);

        const creationDateElement = document.createElement("p");
        creationDateElement.innerText = `Publicado el ${creationDate.split("T")[0]}`;
        this._dateContainer.appendChild(creationDateElement);

        if (publicationTags && publicationTags.length > 0) {
            publicationTags.forEach(({ id, tagName }) => {
                const tag = document.createElement("div");
                const tagText = document.createElement("p");
                tagText.className = "p-0 m-0 d-inline-block text-truncate";
                tagText.innerText = tagName;

                tag.className = "border border-secondary rounded-pill px-2 d-flex flex-row gap-1";
                tag.id = id;

                tag.appendChild(tagText);

                this._tagsContent.appendChild(tag);
            });
        }

        if (images && images.length > 0) {
            this._text.innerText = `1 / ${images.length}`;
            images.forEach(async (idImage, index) => {
                const imageElement = document.createElement("img");
                const data = await this._innerControler.getImage(idImage).then();
                if (data) {
                    const imgUrl = URL.createObjectURL(data);
                    imageElement.src = imgUrl;
                } else {
                    imageElement.src = "../../assets/image.png";
                }

                imageElement.className = "w-50 h-75";
                imageElement.style.display = "none";
                if (index === 0) {
                    imageElement.style.display = "block";
                }

                this._imagesContainer.appendChild(imageElement);
            });
        } else {
            const imageElement = document.createElement("img");
            imageElement.className = "w-50 h-75";
            imageElement.src = "../../assets/image.png";

            this._imagesContainer.appendChild(imageElement);
        }
    }

    showSlides(n) {
        const images = [...this._imagesContainer.children].filter((i) => {
            return i.id !== "ignore";
        });

        if (n > images.length) {
            console.log("this.imageIndex > images.length");
            this.imageIndex = 1;
        }
        if (n < 1) {
            console.log("this.imageIndex < 1");
            this.imageIndex = images.length;
        }
        for (let i = 0; i < images.length; i++) {
            images[i].style.display = "none";
        }
        images[this.imageIndex - 1].style.display = "block";
        this._text.innerText = `${this.imageIndex} / ${images.length}`;
    }

    plusSlides(n) {
        this.showSlides((this.imageIndex += n));
    }

    resetModal() {
        const imagesChildren = [...this._imagesContainer.children];
        imagesChildren.forEach((i) => {
            if (i.id === "ignore") return;
            this._imagesContainer.removeChild(i);
        });

        const descriptionChildren = [...this._descriptionContainer.children];
        descriptionChildren.forEach((i, index) => {
            if (index === 0) return;
            this._descriptionContainer.removeChild(i);
        });

        const exchangeChildren = [...this._exchangeContainer.children];
        exchangeChildren.forEach((i, index) => {
            if (index === 0) return;
            this._exchangeContainer.removeChild(i);
        });

        const stateChildren = [...this._stateContainer.children];
        stateChildren.forEach((i, index) => {
            if (index === 0) return;
            this._stateContainer.removeChild(i);
        });

        const usuarioChildren = [...this._usuarioContainer.children];
        usuarioChildren.forEach((i, index) => {
            if (index === 0) return;
            this._usuarioContainer.removeChild(i);
        });

        const dateChildren = [...this._dateContainer.children];
        dateChildren.forEach((i, index) => {
            if (index === 0) return;
            this._dateContainer.removeChild(i);
        });

        const tagsChildren = [...this._tagsContainer.children];
        tagsChildren.forEach((i, index) => {
            if (index === 0) return;
            this._tagsContainer.removeChild(i);
        });
        this.imageIndex = 1;
        this._modalContainer.style.display = "none";
    }

    connectedCallback() {
        this._modalHeaderClose.onclick = () => {
            this._innerControler.closeModal();
        };

        this._buttonRight.onclick = () => {
            this._innerControler.nextImage();
        };

        this._buttonLeft.onclick = () => {
            this._innerControler.previousImage();
        };

        document.onkeydown = (event) => {
            if (event.key === "Escape") {
                this._innerControler.closeModal();
            }
        };
    }

    disconnectedCallback() {}

    adoptedCallback() {}

    attributesChangedCallback(oldValue, newValue) {}

    static get observableAttributes() {}
}

customElements.define("x-detail-component-view", PublicationDetailView);

export { PublicationDetailView };
