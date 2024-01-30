import Repository from "./Repository";

export default {
    login(payload : any){
        return Repository.post(`/login`, payload)
    } 
}