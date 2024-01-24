import Repository from "./Repository";

export default {
    getAll(language : number) {
        let resource = ""
        if(language == 1){
            resource = "/matchs"
        }else if(language == 2){
            resource = "/matchs"
        }else if(language == 3){
            resource = "/matchs"
        }
        return Repository.get(`${resource}`)
    },
    getOneMatch(id : number, language : number){
        const resource = "/matchs"
        return Repository.get(`${resource}`+`/${id}`)
    }
}