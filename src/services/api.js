const axios = require('axios');

module.exports.Api = class {
    constructor() {
        this.api = axios.create({
            baseURL: 'https://tccapi.projetosufs.cloud/api/v1'
        });
    }
    
    getApi() {
        return this.api;
    }

    setToken(jwt) {
        this.api.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
    }

    register(user) {
        return this.api.post("/accounts/register", {
            nome: user.name,
            email: user.email,
            senha: user.password
        });
    }

    async login(user) {
        await this.api.post("/accounts/login", { email: user.email, senha: user.password })
        .then(res => {
            let jwt = res.data.accessToken;
            this.setToken(jwt);
            localStorage.setItem('access_token', jwt);
        })
        .catch(err => {
            throw err;
        })
    }

    getAtos(filter) {
        let stringFilter = [];
        if (filter.number)
            stringFilter.push(`numero=${filter.number}`)
        if (filter.type)
            stringFilter.push(`tipo=${filter.type}`)
        if (filter.jurisdiction)
            stringFilter.push(`jurisdicao=${filter.jurisdiction}`)
        if (filter.order)
            stringFilter.push(`order=${filter.order}`)
        
        let query = `?${stringFilter.join("&")}`;

        return this.api.get(`/atos${query}`);
    }
}