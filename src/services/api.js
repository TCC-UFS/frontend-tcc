const axios = require('axios');

module.exports.Api = class {
    constructor() {
        this.api = axios.create({
            baseURL: 'https://tccapi.projetosufs.cloud/api/v1'
        });
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

    login(user) {
        this.api.post("/accounts/login", { email: user.email, senha: user.password })
        .then(res => {
            let jwt = res.data.access_token;
            this.setToken(jwt);
            localStorage.setItem('access_token', jwt);
        })
        .catch(err => {
            throw err;
        })
    }
}