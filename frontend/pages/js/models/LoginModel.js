class LoginModel {
    constructor() {
        this._url = 'http://localhost:8080'
    }

    async login(user){
        console.log('user for login', user)
        const response = await fetch(`${this._url}/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...user })
        })
    
        const data = await response.json()
        this._data = data

        return data
    }
}

export { LoginModel }
