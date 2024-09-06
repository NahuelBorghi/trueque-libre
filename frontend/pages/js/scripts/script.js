import { AppModel } from '../models/AppModel.js'
import { AppView } from '../views/AppView.js'

function main() {
    const appModel = new AppModel()
    const appView = new AppView(appModel)
    document.body.appendChild(appView)
}

window.onload = main
