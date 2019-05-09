import { RESTDataSource } from "apollo-datasource-rest";

export class AuthAPI extends RESTDataSource {
    constructor() {
        super()
        this.baseURL = "http://localhost:5502/"
    }

    auth(params) {
        return this.post('/auth', params)
    }
}