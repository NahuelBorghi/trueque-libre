class AppModel extends EventTarget {
    constructor() {
        super()
        this._url = 'http://localhost:8080'
        this._isUserLogged = false
    }

    async register(user){
        console.log('user for register', user)
        const response = await fetch(`${this._url}/user/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...user })
        })
    
        const data = await response.json()
        
        if(data.status !== error){
            this._idUser = data.idUser
            this.dispatchEvent(new CustomEvent('userRegister'))
        }
        console.log('data', data)
        return data
    }
    
    async login(user){
        console.log('user for login', user)
        const response = await fetch(`${this._url}/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...user })
        })
    
        const data = await response.json()

        if(data.status !== "error"){
            this._idUser = data.idUser
            this.dispatchEvent(new CustomEvent('userLogin'))
        }
        console.log('data', data)
        return data
    }
}

export { AppModel }
