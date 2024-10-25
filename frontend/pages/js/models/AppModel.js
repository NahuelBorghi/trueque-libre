class AppModel extends EventTarget {
    constructor() {
        super()
        this._url = 'http://localhost:8080'
        this._offsetPublications = 0
        this._totalPublications = 0
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

    async getCategories(){
        console.log('getCategories')
        const response = await fetch(`${this._url}/tags?limit=6472&offset=0`, {
            credentials: 'include', // Permite el envio y recepción de cookies
        })
        
        const data = await response.json()

        return data.data
    }

    async getPublications(tag){
        console.log('getPublications')
        if ((this._offsetPublications * 10) <= this._totalPublications) {
            const response = await fetch(`${this._url}/publication?limit=10&offset=${this._offsetPublications}${tag != null ? `&tagsFilter=${tag}`:""}`, {
                credentials: 'include', // Permite el envio y recepción de cookies
            })
            const json = await response.json()
            console.log('json', json)
            console.log('total', json.total)
            this._totalPublications = json.total
            this._offsetPublications += 1
            return json
        }
        return { status: 'ok', data: [] }
    }


    async submitPublication({ title, description, state, status, exchange, ubication, tags }){
        console.log('submitPublication')
        const response = await fetch(`${this._url}/publication`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, state, status, exchange, ubication, tags }),
            credentials: 'include', // Permite el envio y recepción de cookies
        })
        return await response.json()
    }
    async submitImage({ idPublication, images }){
        console.log('submitImage')
        const promises = []
        images.forEach((image) => {
            promises.push(fetch(`${this._url}/upload?publicationId=${idPublication}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: image,
                credentials: 'include', // Permite el envio y recepción de cookies
            }))
        });
        
        return await Promise.all(promises)
    }
    
    resetValues(){
        this._offsetPublications = 0
        this._totalPublications = 0

    }
}

export { AppModel }
