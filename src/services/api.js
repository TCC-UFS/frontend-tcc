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
            var user = this.parseJwt(jwt);
            localStorage.setItem('user', user["unique_name"]);
            localStorage.setItem('access_token', jwt);
        })
        .catch(err => {
            throw err;
        })
    }

    parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
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

    getAto(id) {
        return this.api.get(`/atos/${id}`);
    }

    getJurisdictionsDropdown() {
        return this.api.get("/jurisdicoes/dropdown");
    }

    getStats() {
        return this.api.get("/atos/stats");
    }

    getTypes() {
        return this.api.get("/tipos-atos");
    }
    
    search(searchData) {
        var typesMap = {
            "lei-complementar": 2,
            "lei-ordinaria": 1
        }
        var jurisdictionsEnumMap = {
            "Federal": "BR",
            "SE": "SE",
            "AM": "AM"
        }

        if (searchData.term) {
            let data = {
                termo: searchData.term,
                grauAprox: searchData.fuzziness,
                numero: searchData.number,
                tipo: searchData.type,
                jurisdicao: jurisdictionsEnumMap[searchData.jurisdiction],
                order: searchData.order
            }

            return this.api.post(`/search?page=${searchData.page}&limit=${searchData.limit}`, data);
        }

        let queries = [];

        if (searchData.number)
            queries.push(`numero=${searchData.number}`);
        if (searchData.type)
            queries.push(`tipo=${searchData.type}`);
        if (searchData.jurisdiction)
            queries.push(`jurisdicao=${jurisdictionsEnumMap[searchData.jurisdiction]}`);
        if (searchData.year)
            queries.push(`ano=${searchData.year}`)
        if (searchData.order)
            queries.push(`order=${searchData.order}`);

        let query = "";
        if (queries.length > 0)
            query = `?${queries.join("&")}`;

        return this.api.get(`/atos${query}`);
    }
}