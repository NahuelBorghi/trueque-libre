import { ChatController } from "../controllers/ChatController.js";

class ChatView extends HTMLElement {
    constructor(modelComponent) {
        super();
        this._idUser = null;
        this._currentChatId = null;
        this._innerController = new ChatController(this, modelComponent);

        this._container = document.createElement("div");
        this._container.className = "d-flex flex-row";
        this._container.style = "width: 100%; height: 100%";

        this._chatMessagesContainer = document.createElement("div");
        this._chatMessagesContainer.className = "h-100 bg-body-secondary d-flex flex-column";
        this._chatMessagesContainer.style.width = "80%";

        this._messagesContainer = document.createElement("div");
        this._messagesContainer.className = "bg-body-secondary overflow-auto d-flex flex-column h-100 p-3 w-100 gap-2";

        this._chatContainer = document.createElement("form");
        this._chatContainer.classList = "bg-body-tertiary d-flex flex-column align-items-center p-3 gap-2";
        this._textarea = document.createElement("textarea");
        this._textarea.className = "form-control w-100";
        this._textarea.placeholder = "Envie un mensaje";
        this._buttonSend = document.createElement("button");
        this._buttonSend.className = "btn btn-primary w-100";
        this._buttonSend.innerText = "Enviar";

        this._chatContainer.appendChild(this._textarea);
        this._chatContainer.appendChild(this._buttonSend);

        this._chatMessagesContainer.appendChild(this._messagesContainer);

        this._chatList = document.createElement("div");
        this._chatList.className =
            "h-100 bg-body-tertiary border-1 border-end p-3 overflow-auto d-flex flex-column gap-2";
        this._chatList.style.width = "20%";

        this._container.appendChild(this._chatList);
        this._container.appendChild(this._chatMessagesContainer);

        this.appendChild(this._container);
        this.style = "width: 80%;";
    }

    getChats() {
        this._innerController.getChats(this._idUser);
    }

    getMessages(idChat) {
        this._innerController.getMessages(idChat);
    }

    handleListChat(chats) {
        [...this._chatList.children].forEach((i) => this._chatList.removeChild(i));

        chats.forEach(async (chat) => {
            const container = document.createElement("div");
            container.className = "card";
            container.role = "button";

            const content = document.createElement("div");
            content.className = "card-body";

            const fecha = new Date(chat.createdAt);

            const formatter = new Intl.DateTimeFormat("es", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            });

            const fechaFormateada = formatter.format(fecha);

            const date = document.createElement("h6");
            date.className = "card-subtitle text-body-secondary mb-2";
            date.innerText = fechaFormateada;

            const arrayUsers = [
                await this._innerController.getUser(chat.usersIds[0]),
                await this._innerController.getUser(chat.usersIds[1]),
            ];

            const currentUserLogged = arrayUsers.find((user) => user.id === this._idUser);
            const chattingUser = arrayUsers.find((user) => user.id !== this._idUser);

            this._currentUserLogged = currentUserLogged.userName;
            this._otherUser = chattingUser.userName;

            const text = document.createElement("p");
            text.className = "card-text";
            text.innerText = chattingUser.userName;

            content.appendChild(date);
            content.appendChild(text);
            container.appendChild(content);

            container.onclick = () => {
                this._textarea.value = "";
                this._currentChatId = chat._id;
                this._innerController.getMessages(chat._id);
            };

            this._chatList.appendChild(container);
        });
    }

    listMessages(messages) {
        if (messages) {
            const { messagesData } = messages;
            if (messagesData && messagesData.length > 0) {
                [...this._messagesContainer.children].forEach((i) => this._messagesContainer.removeChild(i));
                messagesData.forEach((message) => {
                    this.createMessageTemplate(message);
                });
                this._chatMessagesContainer.appendChild(this._chatContainer);
            }
        }
    }

    async createMessageTemplate(messages) {
        const { userId, message, createdAt } = messages;
        const messageContentContainer = document.createElement("div");
        messageContentContainer.className = "card-body";

        const messageContainer = document.createElement("div");
        messageContainer.style = "width: 30%";
        messageContainer.className = "card align-self-start";

        const newHeaderMessage = document.createElement("div");
        newHeaderMessage.className = "d-flex flex-row gap-3";

        const newUser = document.createElement("p");
        newUser.innerText = this._otherUser;
        newUser.className = "card-title";
        this._currentUserLogged;

        if (userId === this._idUser) {
            messageContainer.className = "card align-self-end";
            newUser.innerText = this._currentUserLogged;
        }

        const fecha = new Date(createdAt);
        const formatter = new Intl.DateTimeFormat("es", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
        const fechaFormateada = formatter.format(fecha);

        const newDate = document.createElement("p");
        newDate.innerText = fechaFormateada;
        newDate.className = "card-title date";
        newDate.id = "date";

        const newParagraph = document.createElement("p");

        newParagraph.innerText = message;
        newParagraph.className = "card-text message-text";
        newParagraph.id = "message-text";

        newHeaderMessage.appendChild(newUser);
        newHeaderMessage.appendChild(newDate);
        messageContentContainer.appendChild(newHeaderMessage);
        messageContentContainer.appendChild(newParagraph);
        messageContainer.appendChild(messageContentContainer);

        this._messagesContainer.appendChild(messageContainer);
        this._messagesContainer.scrollTop = this._messagesContainer.scrollHeight;
    }

    setUserId() {
        const payload = document.cookie.split("=")[1].split(".")[1];
        const decodedPayload = JSON.parse(atob(payload));
        this._idUser = decodedPayload.id;
    }

    connectedCallback() {
        this.setUserId();

        this._chatContainer.onsubmit = (event) => {
            event.preventDefault();
            const message = this._textarea.value;
            this._textarea.value = "";
            this._innerController.sendMessage(this._idUser, this._currentChatId, message);
        };
    }

    disconnectedCallback() {}

    adoptedCallback() {}

    attributesChangedCallback(oldValue, newValue) {}

    static get observableAttributes() {}
}

customElements.define("x-chat-component-view", ChatView);

export { ChatView };
