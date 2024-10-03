import { PublicationController } from "../controllers/PublicationController.js";

class PublicationView extends HTMLElement {
    constructor(modelComponent) {
        super();
        this._innerControler = new PublicationController(this, modelComponent);

        this._navContainer = document.createElement("nav");
        this._navContainer.className = "navbar bg-body-tertiary border-1 border-bottom";

        this._navContent = document.createElement("div");
        this._navContent.className = "container-fluid justify-content-between";

        this._navForm = document.createElement("form");
        this._navForm.className = "d-flex";
        this._navForm.setAttribute("role", "search");

        this._navFormInput = document.createElement("input");
        this._navFormInput.className = "form-control me-2";
        this._navFormInput.type = "search";
        this._navFormInput.placeholder = "Buscar";

        this._navButtonLogout = document.createElement("button");
        this._navButtonLogout.className = "btn btn-secondary";
        this._navButtonLogout.type = "button";
        this._navButtonLogout.innerText = "Cerrar sesión";

        this._navForm.appendChild(this._navFormInput);
        this._navContent.appendChild(this._navForm);
        this._navContent.appendChild(this._navButtonLogout);
        this._navContainer.appendChild(this._navContent);

        this._container = document.createElement("div");
        this._container.className = "d-flex border-5";
        this._container.style = "height: 94%";

        this._sideBarContainer = document.createElement("div");
        this._sideBarContainer.className = "bg-body-tertiary border-1 border-end p-3 d-flex flex-column gap-3";
        this._sideBarContainer.style = "width: 20%; overflow: auto";

        this._sideBarTitle = document.createElement("h3");
        this._sideBarTitle.innerText = "Trueque Libre";

        this._sideBarButtonsContainer = document.createElement("div");
        this._sideBarButtonsContainer.className = "d-flex flex-column w-100 gap-2";

        this._sideBarButtonExplorar = document.createElement("button");
        this._sideBarButtonExplorar.innerText = "Explorar";
        this._sideBarButtonExplorar.className = "btn btn-outline-dark justify-content-start d-flex";
        this._sideBarButtonBandeja = document.createElement("button");
        this._sideBarButtonBandeja.innerText = "Bandeja de entrada";
        this._sideBarButtonBandeja.className = "btn btn-outline-dark justify-content-start d-flex";
        this._sideBarButtonTrueques = document.createElement("button");
        this._sideBarButtonTrueques.innerText = "Trueques";
        this._sideBarButtonTrueques.className = "btn btn-outline-dark justify-content-start d-flex";
        this._sideBarButtonCrearTrueques = document.createElement("button");
        this._sideBarButtonCrearTrueques.innerText = "Crear Trueques";
        this._sideBarButtonCrearTrueques.className = "btn btn-secondary";

        this._sideBarButtonsContainer.appendChild(this._sideBarButtonExplorar);
        this._sideBarButtonsContainer.appendChild(this._sideBarButtonBandeja);
        this._sideBarButtonsContainer.appendChild(this._sideBarButtonTrueques);
        this._sideBarButtonsContainer.appendChild(this._sideBarButtonCrearTrueques);

        this._sideBarUbicationContainer = document.createElement("div");
        this._sideBarUbicationTitle = document.createElement("h4");
        this._sideBarUbicationTitle.innerText = "Ubicación";
        this._sideBarUbicationSubtitle = document.createElement("h6");
        this._sideBarUbicationSubtitle.innerText = "Mar del plata";

        this._sideBarUbicationContainer.appendChild(this._sideBarUbicationTitle);
        this._sideBarUbicationContainer.appendChild(this._sideBarUbicationSubtitle);

        this._sideBarCategoriesContainer = document.createElement("div");
        this._sideBarCategoriesContainer.className = "d-flex flex-column w-100 gap-2";

        this._sideBarCategoriesTitle = document.createElement("h4");
        this._sideBarCategoriesTitle.innerText = "Categorías";

        this._sideBarCategoriesContainer.appendChild(this._sideBarCategoriesTitle);

        this._sideBarContainer.appendChild(this._sideBarTitle);
        this._sideBarContainer.appendChild(this._sideBarButtonsContainer);
        this._sideBarContainer.appendChild(document.createElement("hr"));
        this._sideBarContainer.appendChild(this._sideBarUbicationContainer);
        this._sideBarContainer.appendChild(document.createElement("hr"));
        this._sideBarContainer.appendChild(this._sideBarCategoriesContainer);

        this._publicationsContainer = document.createElement("div");

        this._container.appendChild(this._sideBarContainer);
        this._container.appendChild(this._publicationsContainer);

        this.appendChild(this._navContainer);
        this.appendChild(this._container);
    }

    connectedCallback() {
        this.getCategories();
        this._navButtonLogout.onclick = () => {
            this._innerControler.onPressSignOut();
        };
    }

    async getCategories() {
        const categories = await this._innerControler.getCategories();
        if (categories && categories.length > 0) {
            this.createCategoriesButtons(categories);
        }
        console.log("categories", categories);
    }

    createCategoriesButtons(categories) {
        categories.forEach((categorie) => {
            const button = document.createElement("button");
            button.className = "btn btn-outline-dark justify-content-start d-flex";
            button.innerText = categorie.tagName;
            button.id = categorie.id;
            button.onclick = () => {
                this._innerControler.onClickCategorie(new CustomEvent("categoriePress", { detail: categorie }));
            };
            this._sideBarCategoriesContainer.appendChild(button);
        });
    }

    disconnectedCallback() {}

    adoptedCallback() {}

    attributesChangedCallback(oldValue, newValue) {}

    static get observableAttributes() {}
}

customElements.define("x-publication-component-view", PublicationView);

export { PublicationView };
