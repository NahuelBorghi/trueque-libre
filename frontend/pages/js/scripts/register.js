import { RegisterModel } from '../models/RegisterModel.js'
import { RegisterView } from '../views/RegisterView.js'

function main() {
    const registerModel = new RegisterModel()
    const registerView = new RegisterView(registerModel)
    document.body.appendChild(registerView)
}

window.onload = main
