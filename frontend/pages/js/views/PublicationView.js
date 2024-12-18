import { PublicationController } from "../controllers/PublicationController.js";
import { ModalView } from "./ModalView.js";
import { ChatView } from "./ChatView.js";
import { PublicationDetailView } from "./PublicationDetailView.js";

class PublicationView extends HTMLElement {
    constructor(modelComponent) {
        super();
        this._isLogged = false;
        this._eventSource = {};
        this._eventRetry = 0;
        this._idUser = null;

        this._userChat = [];
        this._categories = [];
        this._selectedTag = null;

        this._innerControler = new PublicationController(this, modelComponent);
        this._publicationDetailView = new PublicationDetailView(modelComponent);
        this._modalView = new ModalView(modelComponent);
        this._chatView = new ChatView(modelComponent);

        this._navContainer = document.createElement("nav");
        this._navContainer.className = "navbar bg-body-tertiary border-1 border-bottom";

        this._navContent = document.createElement("div");
        this._navContent.className = "container-fluid justify-content-between";

        this._navForm = document.createElement("form");
        this._navForm.className = "d-flex";
        this._navForm.setAttribute("role", "search");

        this._imagenISFT = document.createElement("img");
        this._imagenISFT.src = "../../assets/isft.png";
        this._imagenISFT.style.height = "100%";
        this._imagenISFT.style.width = "110px";

        this._navButtonLogout = document.createElement("button");
        this._navButtonLogout.className = "btn btn-secondary";
        this._navButtonLogout.type = "button";
        this._navButtonLogout.innerText = "Cerrar sesión";

        this._navForm.appendChild(this._imagenISFT);
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
        this._sideBarCategoriesSearch.className = "form-control me-2";
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
        this._publicationsContainer.className = "bg-body-secondary d-flex flex-row flex-wrap gap-4 p-3";
        this._publicationsContainer.style = "width: 80%; overflow: scroll; height: 100%";

        this._container.appendChild(this._sideBarContainer);
        this._container.appendChild(this._publicationsContainer);

        this.appendChild(this._navContainer);
        this.appendChild(this._container);
        this.appendChild(this._modalView);
        this.appendChild(this._publicationDetailView);
    }

    connectedCallback() {
        this.handleStartEvent();
        this.getCategories();
        this.getPublications();

        this._navButtonLogout.onclick = () => {
            this._innerControler.onPressExplorar();
            this._eventSource.close();
            this._innerControler.onPressSignOut();
        };

        this._sideBarButtonBandeja.onclick = async () => {
            this._innerControler.onPressBandeja();
        };

        this._sideBarButtonExplorar.onclick = () => {
            this._innerControler.onPressExplorar();
        };

        this._sideBarButtonCrearTrueques.onclick = () => {
            if (this._categories.length > 0) {
                this._categories.forEach((item) => {
                    const option = document.createElement("option");
                    option.innerText = item.tagName;
                    option.value = JSON.stringify(item);
                    this._modalView._selectCategoria.appendChild(option);
                });
            }
            this._modalView._modalContainer.style.display = "block";
        };

        this._modalView._modalHeaderClose.onclick = () => {
            this._modalView.closeModal();
        };

        this._sideBarCategoriesSearch.oninput = () => {
            this.searchCategories();
        };

        this._publicationsContainer.onscroll = async (event) => {
            this.handleOnScroll(event);
        };

        this._eventSource.onopen = () => {
            console.log("Connected to server events");
        };

        this._eventSource.onmessage = (event) => {
            console.log("New message:", event.data);
            this._innerControler.onEventMessage(event.data);
        };

        this._eventSource.onerror = (err) => {
            this._innerControler.onEventError(err);
        };
    }

    handleStartEvent() {
        if (this._isLogged) {
            this._eventSource = new EventSource(`http://localhost:8080/chat/events/${this._idUser}`, {
                withCredentials: true,
            });
        }
    }

    handleEventError(error) {
        console.error("SSE connection error:", error);
    }

    handleEventMessage(data) {
        if (data) {
            const dataParsed = JSON.parse(data);
            if (this._container.childNodes[1] !== this._chatView) {
                this._sideBarButtonBandeja.className = this._sideBarButtonBandeja.className.replace(
                    "btn-outline-dark",
                    "btn-outline-primary"
                );
            }
            if (dataParsed.type === "chat") {
                this._chatView.getChats();
                return;
            }
            this._chatView.createMessageTemplate(dataParsed);
        }
    }

    handlePressBandeja() {
        if (this._container.childNodes[1] !== this._chatContainer) {
            this._container.removeChild(this._container.childNodes[1]);
            this._container.appendChild(this._chatView);
            this._sideBarButtonBandeja.className = this._sideBarButtonBandeja.className.replace(
                "btn-outline-primary",
                "btn-outline-dark"
            );
            this._chatView.getChats();
        }
    }

    setLogged(isLogged) {
        this._isLogged = isLogged;
    }

    setUserId() {
        const payload = document.cookie.split("=")[1].split(".")[1];
        const decodedPayload = JSON.parse(atob(payload));
        this._idUser = decodedPayload.id;
    }

    addPublications() {
        if (this._container.childNodes[1]) {
            this._container.removeChild(this._container.childNodes[1]);
        }
        this._innerControler.fetchNewPublications();
        this._container.appendChild(this._publicationsContainer);
    }

    closeModal() {
        this._modalView._modalContainer.style.display = "none";
    }

    openPublicationDetail(publicationData) {
        this._publicationDetailView.setPublicationData(publicationData);
        this._publicationDetailView._modalContainer.style.display = "block";
    }

    async resetPublications() {
        this._modalView._modalContainer.style.display = "none";
        this._innerControler.resetValues();
        const { data: publications } = await this._innerControler.getPublications();
        [...this._publicationsContainer.children].forEach((publication) => {
            this._publicationsContainer.removeChild(publication);
        });
        if (publications && publications.length > 0) {
            const transformedData = this.transformPublications(publications);
            this.createPublicationsCard(transformedData);
        }
    }

    async handleOnScroll(event) {
        const scrollTop = event.target.scrollTop;
        const scrollHeight = event.target.scrollHeight;
        const clientHeight = event.target.clientHeight;
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            if (!this._innerControler._isFetching) {
                const { data: newPublications } = await this._innerControler.getPublications(this._selectedTag);
                const transformedData = this.transformPublications(newPublications);
                this.createPublicationsCard(transformedData);
            }
        }
    }

    async handleOnClickTag(target) {
        const tag = target.innerText;
        this._innerControler.resetValues();

        if (this._selectedTag === tag) {
            this._selectedTag = null;
            target.className = target.className.split("active")[0];
        } else {
            target.className += " active";
            this._selectedTag = tag;
        }
        const { data: publications } = await this._innerControler.getPublications(this._selectedTag);
        [...this._publicationsContainer.children].forEach((publication) => {
            this._publicationsContainer.removeChild(publication);
        });
        if (publications && publications.length > 0) {
            const transformedData = this.transformPublications(publications);
            this.createPublicationsCard(transformedData);
        }
    }

    transformPublications(publications) {
        const newArray = [];
        const grupos = 5;
        for (let i = 0; i < publications.length; i += grupos) {
            newArray.push(publications.slice(i, i + grupos));
        }

        return newArray;
    }

    async getPublications() {
        const { data: publications } = await this._innerControler.getPublications();
        if (publications && publications.length > 0) {
            const transformedData = this.transformPublications(publications);
            this.createPublicationsCard(transformedData);
        }
    }

    async getCategories() {
        const categories = await this._innerControler.getCategories();
        this._categories = categories;
        if (categories && categories.length > 0) {
            this.createCategoriesButtons(categories);
        }
    }

    searchCategories() {
        const search = this._sideBarCategoriesSearch.value
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/ /g, "");
        const filteredCategories = this._categories.filter((categorie) =>
            categorie.tagName
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/ /g, "")
                .includes(search)
        );

        this.createCategoriesButtons(filteredCategories);
    }

    createCategoriesButtons(categories) {
        while (this._sideBarCategoriesContainer.childElementCount > 2) {
            this._sideBarCategoriesContainer.removeChild(this._sideBarCategoriesContainer.lastChild);
        }
        if (categories.length > 50) {
            categories = categories.sort(() => Math.random() - 0.5);
        } else {
            categories = categories.sort((a, b) => a.tagName.localeCompare(b.tagName));
        }
        categories.forEach((categorie) => {
            // el 2+4 es por el titulo y el input de buscar, 4 son los botones de categorias
            if (this._sideBarCategoriesContainer.childElementCount < 2 + 7) {
                const button = document.createElement("button");
                button.className = "btn btn-outline-dark justify-content-start d-flex";
                button.innerText = categorie.tagName;
                button.id = categorie.id;
                button.onclick = (event) => {
                    this._innerControler.onClickCategorie(new CustomEvent("categoriePress", { detail: event }));
                };
                this._sideBarCategoriesContainer.appendChild(button);
            }
        });
    }

    createPublicationsCard(publications) {
        publications.forEach((publicationRow) => {
            const rowContainer = document.createElement("div");
            rowContainer.className = "row justify-content-between column-gap-3";
            publicationRow.forEach(async (publication) => {
                const containerColumn = document.createElement("div");
                containerColumn.className = "col";
                containerColumn.id = publication.id;

                const containerCard = document.createElement("div");
                containerCard.className = "card pb-3";
                containerCard.style.width = "16rem";
                containerCard.style.cursor = "pointer";
                
                containerCard.onmouseenter = () => {
                    // this._innerControler.onClickVisualize(new CustomEvent("categoriePress", { detail: publication }));
                    containerCard.className = 'card pb-3 bg-body-secondary border-secondary'
                };
                containerCard.onmouseleave = () => {
                    // this._innerControler.onClickVisualize(new CustomEvent("categoriePress", { detail: publication }));
                    containerCard.className = 'card pb-3'
                };
                containerCard.onclick = () => {
                    this._innerControler.onClickVisualize(new CustomEvent("categoriePress", { detail: publication }));
                };

                const image = document.createElement("img");
                image.className = "card-img-top";
                image.style.maxHeight = "200px";
                image.src = "../../assets/image.png";

                const data = await this._innerControler.getImage(publication.images?.[0]);
                if (data) {
                    const imgUrl = URL.createObjectURL(data);

                    image.src = imgUrl;
                }

                const content = document.createElement("div");
                content.className = "card-body d-flex flex-column gap-2";

                const title = document.createElement("h5");
                title.className = "card-title";
                title.innerText = publication.title;

                const tagsContainer = document.createElement("div");
                tagsContainer.className = "d-flex gap-2 flex-wrap";

                publication.publicationTags.forEach((publicationTag) => {
                    if (publicationTag) {
                        const tags = document.createElement("div");
                        tags.className = "d-flex border border-secondary rounded-pill px-2";

                        const tagName = document.createElement("p");
                        tagName.className = "p-0 m-0 d-inline-block text-truncate";
                        tagName.style.fontSize = "12px";
                        tagName.style.maxWidth = "100px";
                        tagName.style.textAlign = "center";
                        tagName.innerText = publicationTag.tagName;

                        tags.appendChild(tagName);
                        tagsContainer.appendChild(tags);
                    }
                });

                const description = document.createElement("p");
                description.className = "card-text overflow-hidden";
                description.style = "display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical;";
                description.innerText = publication.description;

                content.appendChild(title);
                content.appendChild(tagsContainer);
                content.appendChild(description);
                // content.appendChild(button);
                containerCard.appendChild(image);
                containerCard.appendChild(content);
                containerColumn.appendChild(containerCard);
                rowContainer.appendChild(containerColumn);
            });

            this._publicationsContainer.appendChild(rowContainer);
        });
    }

    disconnectedCallback() {}

    adoptedCallback() {}

    attributesChangedCallback(oldValue, newValue) {}

    static get observableAttributes() {}
}

customElements.define("x-publication-component-view", PublicationView);

export { PublicationView };
