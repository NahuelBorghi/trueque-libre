class AppModel extends EventTarget {
    constructor() {
        super()
        this._url = 'http://localhost:8080'
    }

    async register(user){
        console.log('user for register', user)
        const response = await fetch(`${this._url}/user/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...user })
        })
    
        const data = await response.json()
        
        if(data.status !== "error"){
            this._idUser = data.userID
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
            body: JSON.stringify({ ...user }),
            credentials: 'include' // Permite el envio y recepción de cookies
        })
    
        const data = await response.json()

        if(data.status !== "error"){
            this._idUser = data.userID
            this.dispatchEvent(new CustomEvent('userLogin'))
        }
        console.log('data', data)
        return data
    }
 
    async logout(){
        console.log('idUser', this._idUser)
        const response = await fetch(`${this._url}/user/logout`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Permite el envio y recepción de cookies
            body: JSON.stringify({ idUser: this._idUser })
        })

        const data = await response.json()

        if(data.status !== "error"){
            this.dispatchEvent(new CustomEvent('userLogout'))
        }
        console.log('data', data)
        return data
    }

    async verify(){
        console.log('verify')
        const response = await fetch(`${this._url}/user/verify`, {
            credentials: 'include', // Permite el envio y recepción de cookies
        })
        console.log('first')
        this.dispatchEvent(new CustomEvent('tokenVerify', { detail: response }))
    }
}

export { AppModel }
