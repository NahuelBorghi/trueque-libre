import { PublicationController } from "../controllers/PublicationController.js";

class PublicationView extends HTMLElement {
    constructor(modelComponent) {
        super();

        this.categories = [];

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

        this._sideBarCategoriesSearch = document.createElement("input");
        this._sideBarCategoriesSearch.placeholder = "Buscar categoría";

        this._sideBarCategoriesContainer.appendChild(this._sideBarCategoriesTitle);
        this._sideBarCategoriesContainer.appendChild(this._sideBarCategoriesSearch);

        this._sideBarContainer.appendChild(this._sideBarTitle);
        this._sideBarContainer.appendChild(this._sideBarButtonsContainer);
        this._sideBarContainer.appendChild(document.createElement("hr"));
        this._sideBarContainer.appendChild(this._sideBarUbicationContainer);
        this._sideBarContainer.appendChild(document.createElement("hr"));
        this._sideBarContainer.appendChild(this._sideBarCategoriesContainer);

        this._publicationsContainer = document.createElement("div");
        this._publicationsContainer.className = 'bg-body-secondary d-flex flex-row flex-wrap gap-4 p-3'
        this._publicationsContainer.style = 'width: 80%; overflow: auto; height: 100%'

        this._container.appendChild(this._sideBarContainer);
        this._container.appendChild(this._publicationsContainer);

        this.appendChild(this._navContainer);
        this.appendChild(this._container);
    }

    connectedCallback() {
        this.getCategories();
        this.getPublications();
        this._navButtonLogout.onclick = () => {
            this._innerControler.onPressSignOut();
        };
        this._sideBarCategoriesSearch.oninput = () => {
            this.searchCategories();
        };
    }

    transformPublications(publications){
        const newArray = []
        const grupos = 5
        for (let i = 0; i < publications.length; i += grupos) {
            newArray.push(publications.slice(i, i + grupos));
        }

        return newArray
    }

    async getPublications() {
        const { data: publications, total} = await this._innerControler.getPublications();
        if (publications && publications.length > 0) {
            const transformedData = this.transformPublications(publications)
            this.createPublicationsCard(transformedData, Math.round(total[0].total / 5));
        }
    }

    async getCategories() {
        const categories = await this._innerControler.getCategories();
        this.categories = categories;
        if (categories && categories.length > 0) {
            this.createCategoriesButtons(categories);
        }
        console.log("categories", categories);
    }

    searchCategories() {
        const search = this._sideBarCategoriesSearch.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, "");
        const filteredCategories = this.categories.filter((categorie) =>
            categorie.tagName
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/ /g, "")
                .includes(search)
        );
        console.log("filteredCategories", filteredCategories);
        this.createCategoriesButtons(filteredCategories);
    }

    createCategoriesButtons(categories) {
        while (this._sideBarCategoriesContainer.childElementCount > 2) {
            this._sideBarCategoriesContainer.removeChild(this._sideBarCategoriesContainer.lastChild);
        }
        if (categories.length > 50) categories = categories.sort(() => Math.random() - 0.5);
        else categories = categories.sort((a, b) => a.tagName.localeCompare(b.tagName));
        categories.forEach((categorie) => {
            // el 2+4 es por el titulo y el input de buscar, 4 son los botones de categorias
            if (this._sideBarCategoriesContainer.childElementCount < (2+4)) {
                const button = document.createElement("button");
                button.className = "btn btn-outline-dark justify-content-start d-flex";
                button.innerText = categorie.tagName;
                button.id = categorie.id;
                button.onclick = () => {
                    this._innerControler.onClickCategorie(new CustomEvent("categoriePress", { detail: categorie }));
                };
                this._sideBarCategoriesContainer.appendChild(button);
            }
        });
    }

    createPublicationsCard(publications, amountRows) {
        publications.forEach((publicationRow) => {
            const rowContainer = document.createElement('div')
            rowContainer.className = 'row justify-content-between column-gap-3'
            publicationRow.forEach((publication) => {
                const containerColumn = document.createElement('div')
                containerColumn.className = 'col'
                containerColumn.id = publication.id

                const containerCard = document.createElement('div')
                containerCard.className = 'card'
                containerCard.style = 'width: 16rem'

                const image = document.createElement('img')
                image.className = 'card-img-top'
                image.src = 'https://media.istockphoto.com/id/1496378856/es/foto/mostrar-el-smartphone-durante-la-conferencia.jpg?s=2048x2048&w=is&k=20&c=SvMzrj9vTqIs__fauYNimKkawTdXCn9-NXCIBRyXDWk='

                const content = document.createElement('div')
                content.className = 'card-body'

                const title = document.createElement('h5')
                title.className = 'card-title'
                title.innerText = publication.title

                const description = document.createElement('p')
                description.className = 'card-text'
                description.innerText = publication.description

                const button = document.createElement("button");

                button.className = "btn btn-primary";
                button.innerText = 'Visualizar';
                // button.onclick = () => {
                //     this._innerControler.onClickCategorie(new CustomEvent("categoriePress", { detail: categorie }));
                // };

                content.appendChild(title)
                content.appendChild(description)
                content.appendChild(button)
                containerCard.appendChild(image)
                containerCard.appendChild(content)
                containerColumn.appendChild(containerCard)
                rowContainer.appendChild(containerColumn)
            });

            this._publicationsContainer.appendChild(rowContainer)
        })
    }

    disconnectedCallback() {}

    adoptedCallback() {}

    attributesChangedCallback(oldValue, newValue) {}

    static get observableAttributes() {}
}

customElements.define("x-publication-component-view", PublicationView);

export { PublicationView };
