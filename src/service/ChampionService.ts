import Repository from "./Repository";

export default {
    getChampionById(id : number, language : number) {
        let resource = ""
        if(language == 1){
            resource = "/champions"
        }else if(language == 2){
            resource = "/champions"
        }else if(language == 3){
            resource = "/champions"
        }
        return Repository.get(`${resource}/${id}`)
    }
}