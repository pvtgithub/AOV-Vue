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
        return Repository.get(`${resource}?_sort=date&_order=desc`)
    },
    getOneMatch(id : number, language : number){
        const resource = "/matchs"
        return Repository.get(`${resource}`+`/${id}`)
    },
    postMatch(data : any){
        return Repository.post("/matchs", data)
    },
    deleteMatchById(id : number){
        return Repository.delete(`/matchs/${id}`)
    }
}