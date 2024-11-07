class AppModel extends EventTarget {
    constructor() {
        super();
        this._url = "http://localhost:8080";
        this._offsetPublications = 0;
        this._totalPublications = 0;
    }

    async register(user) {
        const response = await fetch(`${this._url}/user/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...user }),
        });

        const data = await response.json();

        if (data.status !== "error") {
            this._idUser = data.userID;
            this.dispatchEvent(new CustomEvent("userRegister"));
        }
        console.log("register data", data);
        return data;
    }

    async login(user) {
        const response = await fetch(`${this._url}/user/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...user }),
            credentials: "include", // Permite el envio y recepción de cookies
        });

        const data = await response.json();

        if (data.status !== "error") {
            this._idUser = data.userID;
            this.dispatchEvent(new CustomEvent("userLogin"));
        }
        console.log("login data", data);
        return data;
    }

    async logout() {
        const response = await fetch(`${this._url}/user/logout`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Permite el envio y recepción de cookies
            body: JSON.stringify({ idUser: this._idUser }),
        });

        const data = await response.json();

        if (data.status !== "error") {
            this.dispatchEvent(new CustomEvent("userLogout"));
        }
        console.log("logout data", data);
        return data;
    }

    async verify() {
        const response = await fetch(`${this._url}/user/verify`, {
            credentials: "include", // Permite el envio y recepción de cookies
        });
        this.dispatchEvent(new CustomEvent("tokenVerify", { detail: response }));
    }

    async getCategories() {
        const response = await fetch(`${this._url}/tags?limit=6472&offset=0`, {
            credentials: "include", // Permite el envio y recepción de cookies
        });

        const data = await response.json();
        console.log("getCategories data", data);

        return data.data;
    }

    async getPublications(tag) {
        if (this._offsetPublications * 15 <= this._totalPublications) {
            const response = await fetch(
                `${this._url}/publication?limit=15&offset=${this._offsetPublications}${
                    tag != null ? `&tagsFilter=${tag}` : ""
                }`,
                {
                    credentials: "include", // Permite el envio y recepción de cookies
                }
            );
            const json = await response.json();
            console.log("getPublications data", json);
            this._totalPublications = json.total;
            this._offsetPublications += 1;
            return json;
        }
        return { status: "ok", data: [] };
    }

    async submitPublication({ title, description, state, status, exchange, ubication, tags, images }) {
        console.log("submitPublication");
        const response = await fetch(`${this._url}/publication`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                description,
                state,
                status,
                exchange,
                ubication,
                tags,
            }),
            credentials: "include", // Permite el envio y recepción de cookies
        });
        const { id: idPublication } = await response.json();

        if (idPublication) {
            if (images.length > 0) {
                const promises = images.map((image) =>
                    fetch(`${this._url}/image/upload?publicationId=${idPublication}`, {
                        method: "POST",
                        body: image,
                        credentials: "include", // Permite el envío y recepción de cookies
                    })
                );

                const dataPromises = await Promise.all(promises);

                const errorSubmitingImage = dataPromises.some((item) => {
                    return !item.ok;
                });

                if (errorSubmitingImage) {
                    alert("Error al intentar subir una imagen");
                }
            }
            this.dispatchEvent(new CustomEvent("submitPublication"));
            return;
        }
        alert("Error, intente de nuevo en unos momentos");
    }

    async getImages(idImage) {
        console.log("getImages");

        const response = await fetch(`${this._url}/image/${idImage}`, {
            credentials: "include", // Permite el envío y recepción de cookies
        });

        return response;
    }

    async getUserById(idUser) {
        const response = await fetch(`${this._url}/user/userById?id=${idUser}`, {
            credentials: "include", // Permite el envío y recepción de cookies
        });

        const data = await response.json();
        console.log("getUserById data", data);

        return data;
    }

    async getChats(idUser) {
        const response = await fetch(`${this._url}/chat/chats/${idUser}`, {
            credentials: "include", // Permite el envío y recepción de cookies
        });

        const data = await response.json();
        console.log("getChats data", data);

        return data;
    }

    async createChat(idUserSender, idUserReceptor) {
        const response = await fetch(`${this._url}/chat/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usersIds: [idUserSender, idUserReceptor] }),
            credentials: "include", // Permite el envío y recepción de cookies
        });

        const data = await response.json();
        console.log("createChat data", data);

        return data;
    }

    async sendMessage(idUser, idChat, message) {
        const response = await fetch(`${this._url}/chat/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: idUser, chatId: idChat, message }),
            credentials: "include", // Permite el envío y recepción de cookies
        });

        const data = await response.json();
        console.log("sendMessage data", data);

        return data;
    }

    async getMessages(idChat) {
        const response = await fetch(`${this._url}/chat/messages/${idChat}`, {
            credentials: "include", // Permite el envío y recepción de cookies
        });

        const data = await response.json();
        console.log("getMessages data", data);

        return data;
    }

    resetValues() {
        this._offsetPublications = 0;
        this._totalPublications = 0;
    }
}

export { AppModel };
