class RegisterModel {
    constructor() {
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
    
        return data
    }
}

export { RegisterModel }
