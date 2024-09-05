import { LoginModel } from '../models/LoginModel.js'
import { LoginView } from '../views/LoginView.js'

function main() {
    const loginModel = new LoginModel()
    const loginView = new LoginView(loginModel)
    document.body.appendChild(loginView)
}

window.onload = main
